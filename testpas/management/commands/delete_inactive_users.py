"""
Django management command to delete inactive users from the database.

Inactive users include:
1. Users who created accounts but never completed eligibility questionnaire
2. Users marked as ineligible (eligible=False)
3. Users who completed/exceeded the study (Day > 134)
4. All of the above

Usage:
    # Show all inactive users (dry run):
    python manage.py delete_inactive_users --dry-run

    # Delete users who never completed eligibility:
    python manage.py delete_inactive_users --category incomplete

    # Delete ineligible users only:
    python manage.py delete_inactive_users --category ineligible

    # Delete users beyond study timeline:
    python manage.py delete_inactive_users --category expired

    # Delete ALL inactive users (all categories):
    python manage.py delete_inactive_users --category all
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from testpas.models import UserSurveyProgress, Participant
from testpas.timeline import get_study_day
from testpas.utils import get_current_time
from django.db import transaction
from django.conf import settings


class Command(BaseCommand):
    help = 'Delete inactive users (never completed eligibility, ineligible, or expired)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--category',
            type=str,
            choices=['incomplete', 'ineligible', 'expired', 'all'],
            help='Category of inactive users to delete',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be deleted without actually deleting',
        )
        parser.add_argument(
            '--no-input',
            action='store_true',
            help='Skip confirmation prompt (use with caution)',
        )

    def get_inactive_user_categories(self):
        """Identify different categories of inactive users"""
        
        # Category 1: Never completed eligibility (no UserSurveyProgress)
        all_users = User.objects.all()
        users_with_progress = UserSurveyProgress.objects.values_list('user_id', flat=True)
        incomplete_users = all_users.exclude(id__in=users_with_progress)
        
        # Category 2: Ineligible users (eligible=False)
        ineligible_progress = UserSurveyProgress.objects.filter(eligible=False)
        ineligible_user_ids = list(ineligible_progress.values_list('user_id', flat=True))
        ineligible_users = User.objects.filter(id__in=ineligible_user_ids)
        
        # Category 3: Expired users (beyond Day 134)
        expired_user_ids = []
        now = get_current_time()
        compressed = getattr(settings, 'TIME_COMPRESSION', False)
        seconds_per_day = getattr(settings, 'SECONDS_PER_DAY', 86400)
        
        for progress in UserSurveyProgress.objects.filter(eligible=True, consent_given=True, day_1__isnull=False):
            try:
                study_day = get_study_day(
                    progress.day_1,
                    now=now,
                    compressed=compressed,
                    seconds_per_day=seconds_per_day,
                    reference_timestamp=progress.timeline_reference_timestamp
                )
                if study_day and study_day > 134:
                    expired_user_ids.append(progress.user_id)
            except Exception:
                pass
        
        expired_users = User.objects.filter(id__in=expired_user_ids)
        
        return {
            'incomplete': incomplete_users,
            'ineligible': ineligible_users,
            'expired': expired_users,
        }

    def display_category(self, category_name, users, description):
        """Display information about a category of inactive users"""
        count = users.count()
        
        self.stdout.write(f'\n{description}')
        self.stdout.write(self.style.WARNING(f'Found {count} user(s)'))
        
        if count > 0:
            self.stdout.write('-' * 80)
            for user in users[:5]:  # Show first 5
                try:
                    participant = Participant.objects.get(user=user)
                    participant_id = participant.participant_id
                    email = participant.email or user.email
                except Participant.DoesNotExist:
                    participant_id = 'N/A'
                    email = user.email
                
                self.stdout.write(
                    f'  • ID: {user.id:4d} | Username: {user.username:20s} | Email: {email}'
                )
            
            if count > 5:
                self.stdout.write(f'  ... and {count - 5} more')
            self.stdout.write('-' * 80)
        
        return count

    def handle(self, *args, **options):
        category = options.get('category')
        dry_run = options['dry_run']
        no_input = options['no_input']

        # Get all categories
        categories = self.get_inactive_user_categories()
        
        # If no category specified, show all and exit
        if not category:
            self.stdout.write(self.style.SUCCESS('\n=== INACTIVE USERS REPORT ===\n'))
            
            total = 0
            total += self.display_category(
                'incomplete',
                categories['incomplete'],
                '1. INCOMPLETE SIGNUPS (never completed eligibility questionnaire):'
            )
            total += self.display_category(
                'ineligible',
                categories['ineligible'],
                '2. INELIGIBLE USERS (failed eligibility screening):'
            )
            total += self.display_category(
                'expired',
                categories['expired'],
                '3. EXPIRED USERS (exceeded study timeline, Day > 134):'
            )
            
            self.stdout.write(self.style.SUCCESS(f'\n📊 Total inactive users: {total}'))
            self.stdout.write('\nTo delete a category, run:')
            self.stdout.write('  python manage.py delete_inactive_users --category incomplete')
            self.stdout.write('  python manage.py delete_inactive_users --category ineligible')
            self.stdout.write('  python manage.py delete_inactive_users --category expired')
            self.stdout.write('  python manage.py delete_inactive_users --category all')
            return

        # Determine which users to delete based on category
        if category == 'all':
            users_to_delete = User.objects.filter(
                id__in=list(categories['incomplete'].values_list('id', flat=True)) +
                       list(categories['ineligible'].values_list('id', flat=True)) +
                       list(categories['expired'].values_list('id', flat=True))
            ).distinct()
            category_description = 'ALL inactive users (incomplete + ineligible + expired)'
        else:
            users_to_delete = categories[category]
            category_descriptions = {
                'incomplete': 'users who never completed eligibility',
                'ineligible': 'ineligible users (failed screening)',
                'expired': 'expired users (Day > 134)',
            }
            category_description = category_descriptions[category]

        count = users_to_delete.count()

        if count == 0:
            self.stdout.write(self.style.SUCCESS(f'\nNo {category_description} found.'))
            return

        # Display what will be deleted
        self.stdout.write(self.style.WARNING(f'\n📋 Deleting: {category_description}'))
        self.stdout.write(self.style.WARNING(f'Found {count} user(s) to delete:'))
        self.stdout.write('=' * 80)

        for user in users_to_delete[:10]:  # Show first 10
            try:
                participant = Participant.objects.get(user=user)
                participant_id = participant.participant_id
                email = participant.email or user.email
            except Participant.DoesNotExist:
                participant_id = 'N/A'
                email = user.email
            
            self.stdout.write(
                f'  • User ID: {user.id:4d} | Username: {user.username:20s} | Email: {email:30s} | PID: {participant_id}'
            )

        if count > 10:
            self.stdout.write(f'  ... and {count - 10} more')

        self.stdout.write('=' * 80)

        # Show related data that will be deleted
        user_ids = list(users_to_delete.values_list('id', flat=True))
        participants_count = Participant.objects.filter(user_id__in=user_ids).count()
        progress_count = UserSurveyProgress.objects.filter(user_id__in=user_ids).count()
        
        self.stdout.write(self.style.WARNING('\n🗑️  Related data that will be deleted (CASCADE):'))
        self.stdout.write(f'  • {count} User(s)')
        self.stdout.write(f'  • {participants_count} Participant(s)')
        self.stdout.write(f'  • {progress_count} UserSurveyProgress record(s)')
        self.stdout.write('  • (and other related records via CASCADE)')

        # Dry run mode
        if dry_run:
            self.stdout.write(self.style.SUCCESS(
                '\n✓ DRY RUN MODE - No data was deleted. '
                'Run without --dry-run to actually delete.'
            ))
            return

        # Confirmation prompt (unless --no-input)
        if not no_input:
            self.stdout.write(self.style.ERROR(
                '\n⚠️  WARNING: This action is IRREVERSIBLE! ⚠️'
            ))
            self.stdout.write(self.style.ERROR(
                f'All {count} {category_description} and their related data will be permanently deleted.'
            ))
            
            confirmation = input('\nType "DELETE INACTIVE USERS" to confirm: ')
            
            if confirmation != 'DELETE INACTIVE USERS':
                self.stdout.write(self.style.ERROR('❌ Deletion cancelled.'))
                return

        # Perform deletion in a transaction
        try:
            with transaction.atomic():
                deleted_count, details = users_to_delete.delete()
                
                self.stdout.write(self.style.SUCCESS(
                    f'\n✅ Successfully deleted {count} {category_description} and related data.'
                ))
                
                # Show deletion details
                self.stdout.write('\n📊 Deletion details:')
                for model, model_count in details.items():
                    if model_count > 0:
                        self.stdout.write(f'  • {model}: {model_count}')

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\n❌ Error during deletion: {str(e)}'))
            raise
