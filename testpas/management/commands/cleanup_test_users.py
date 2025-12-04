"""
Management command to clean up old test users:
- Users who completed the study (Day > 134)
- Users who are not eligible
- Users who haven't completed eligibility/consent
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import transaction
from testpas.models import Participant, UserSurveyProgress
from testpas.timeline import get_study_day
from testpas.utils import get_current_time
from testpas import settings


class Command(BaseCommand):
    help = 'Clean up old test users (completed, ineligible, or incomplete)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirm that you want to delete users'
        )
        parser.add_argument(
            '--completed-only',
            action='store_true',
            help='Only delete users who completed the study (Day > 134)'
        )
        parser.add_argument(
            '--ineligible-only',
            action='store_true',
            help='Only delete users who are not eligible'
        )
        parser.add_argument(
            '--incomplete-only',
            action='store_true',
            help='Only delete users who haven\'t completed eligibility/consent'
        )

    def handle(self, *args, **options):
        if not options['confirm']:
            self.stdout.write(
                self.style.WARNING(
                    "This will delete test users from the database!\n"
                    "Run with --confirm to proceed.\n"
                    "Use --completed-only, --ineligible-only, or --incomplete-only to filter."
                )
            )
            return

        users_to_delete = []
        reasons = {}

        # Get all users
        all_users = User.objects.filter(is_superuser=False)
        
        for user in all_users:
            user_progress = UserSurveyProgress.objects.filter(
                user=user,
                survey__title="Eligibility Criteria"
            ).first()

            # Check for incomplete users (no progress or no consent)
            if not user_progress or not user_progress.consent_given or not user_progress.day_1:
                if options['incomplete_only'] or (not options['completed_only'] and not options['ineligible_only']):
                    users_to_delete.append(user)
                    reasons[user.id] = 'incomplete (no eligibility/consent)'
                continue

            # Check for ineligible users
            if not user_progress.eligible:
                if options['ineligible_only'] or (not options['completed_only'] and not options['incomplete_only']):
                    users_to_delete.append(user)
                    reasons[user.id] = 'not eligible'
                continue

            # Check for completed users (Day > 134)
            try:
                participant = getattr(user, 'participant', None)
                if participant:
                    today = get_study_day(
                        user_progress.day_1,
                        now=get_current_time(),
                        compressed=settings.TIME_COMPRESSION,
                        seconds_per_day=settings.SECONDS_PER_DAY,
                        reference_timestamp=user_progress.timeline_reference_timestamp
                    )
                    
                    if today and today > 134:
                        if options['completed_only'] or (not options['ineligible_only'] and not options['incomplete_only']):
                            users_to_delete.append(user)
                            reasons[user.id] = f'completed study (Day {today})'
            except Exception as e:
                # If we can't calculate study day, skip this user
                self.stdout.write(
                    self.style.WARNING(f"Could not calculate study day for user {user.id}: {str(e)}")
                )
                continue

        if not users_to_delete:
            self.stdout.write(self.style.SUCCESS("No users found to delete."))
            return

        # Show what will be deleted
        self.stdout.write(f"\nFound {len(users_to_delete)} users to delete:")
        for user in users_to_delete[:10]:  # Show first 10
            reason = reasons.get(user.id, 'unknown')
            self.stdout.write(f"  - {user.username} (ID: {user.id}): {reason}")
        
        if len(users_to_delete) > 10:
            self.stdout.write(f"  ... and {len(users_to_delete) - 10} more")

        # Delete users (this will cascade delete participants and related data)
        with transaction.atomic():
            deleted_count = 0
            for user in users_to_delete:
                username = user.username
                user.delete()
                deleted_count += 1
                self.stdout.write(f"Deleted user: {username}")

        self.stdout.write(
            self.style.SUCCESS(
                f"\nSuccessfully deleted {deleted_count} users and their associated data."
            )
        )

