"""
Management command to manually run the daily timeline check.
This can be used instead of Celery for testing or if Celery is not available.
"""
from django.core.management.base import BaseCommand
from testpas.tasks import run_daily_timeline_checks

class Command(BaseCommand):
    help = 'Manually run the daily timeline check (sends emails, processes randomization, etc.)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--user-id',
            type=int,
            help='Run timeline check for a specific user ID only',
        )

    def handle(self, *args, **options):
        user_id = options.get('user_id')
        
        if user_id:
            from testpas.models import User
            from testpas.tasks import daily_timeline_check
            try:
                user = User.objects.get(id=user_id)
                self.stdout.write(f'Running timeline check for user {user_id} ({user.username})...')
                daily_timeline_check(user)
                self.stdout.write(self.style.SUCCESS('✓ Timeline check completed'))
            except User.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'User {user_id} not found'))
        else:
            self.stdout.write('Running daily timeline check for all users...')
            self.stdout.write('This will check each user and send emails if they are on the correct study day.')
            self.stdout.write('')
            run_daily_timeline_checks()
            self.stdout.write('')
            self.stdout.write(self.style.SUCCESS('✓ Timeline check completed for all users'))

