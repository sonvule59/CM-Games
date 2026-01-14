"""
Management command to send Study End Survey & Monitor Return emails (Information 24) to participants on Day 120.
Can also be used to manually send emails to participants who should have received them.
"""
from django.core.management.base import BaseCommand
from testpas.models import Participant, EmailTemplate, UserSurveyProgress
from testpas.utils import get_current_time
from testpas.timeline import get_study_day
from django.conf import settings
import logging


class Command(BaseCommand):
    help = 'Send Study End Survey & Monitor Return emails (Information 24) to participants on Day 120'

    def add_arguments(self, parser):
        parser.add_argument(
            '--check-only',
            action='store_true',
            help='Only check which participants should receive emails, do not send them',
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Send emails even if already sent (for testing)',
        )
        parser.add_argument(
            '--day',
            type=int,
            help='Override the day check - send to participants on this study day (default: 120)',
        )

    def handle(self, *args, **options):
        check_only = options['check_only']
        force = options['force']
        target_day = options.get('day', 120)
        
        # Check if email template exists
        try:
            template = EmailTemplate.objects.get(name='study_end')
            self.stdout.write(self.style.SUCCESS('Email template "study_end" found in database.'))
        except EmailTemplate.DoesNotExist:
            self.stdout.write(self.style.ERROR(
                'Email template "study_end" not found in database.\n'
                'Please run: python manage.py seed_email_template'
            ))
            return
        
        # Get all participants
        participants = Participant.objects.select_related('user').all()
        
        if not participants.exists():
            self.stdout.write(self.style.WARNING('No participants found in database.'))
            return
        
        self.stdout.write(f'\nChecking participants for Day {target_day} (Information 24: Study End Survey & Monitor Return)...\n')
        
        eligible_count = 0
        sent_count = 0
        skipped_count = 0
        error_count = 0
        
        for participant in participants:
            user = participant.user
            if not user:
                continue
            
            # Get study day
            try:
                user_progress = UserSurveyProgress.objects.get(user=user)
                if not user_progress.day_1:
                    self.stdout.write(self.style.WARNING(
                        f'  User {user.id} ({user.username}): No day_1 set, skipping.'
                    ))
                    continue
            except UserSurveyProgress.DoesNotExist:
                self.stdout.write(self.style.WARNING(
                    f'  User {user.id} ({user.username}): No UserSurveyProgress found, skipping.'
                ))
                continue
            
            # Calculate study day
            now = get_current_time()
            study_day = get_study_day(
                user_progress.day_1,
                now=now,
                compressed=getattr(settings, 'TIME_COMPRESSION', False),
                seconds_per_day=getattr(settings, 'SECONDS_PER_DAY', 86400),
                reference_timestamp=user_progress.timeline_reference_timestamp
            )
            
            # Check if participant should receive email
            should_send = False
            reason = ""
            
            if study_day == target_day:
                if not participant.wave3_survey_monitor_return_sent or force:
                    should_send = True
                    reason = f"On Day {study_day}"
                else:
                    reason = f"Already sent (Day {study_day})"
            else:
                reason = f"Not on Day {target_day} (currently Day {study_day})"
            
            if should_send:
                eligible_count += 1
                
                if check_only:
                    self.stdout.write(self.style.WARNING(
                        f'  [CHECK ONLY] Would send to: {participant.participant_id} ({user.username}) - {reason}'
                    ))
                else:
                    try:
                        # Send email
                        participant.send_email(
                            "study_end",
                            extra_context={"username": user.username}
                        )
                        participant.wave3_survey_monitor_return_sent = True
                        participant.wave3_survey_monitor_return_date = get_current_time().date()
                        participant.save()
                        
                        sent_count += 1
                        self.stdout.write(self.style.SUCCESS(
                            f'  ✓ Sent to: {participant.participant_id} ({user.username}) - {reason}'
                        ))
                        print(f"[SEND] Manually sent Study End Survey & Monitor Return email to {participant.participant_id}")
                    except Exception as e:
                        error_count += 1
                        self.stdout.write(self.style.ERROR(
                            f'  ✗ ERROR sending to {participant.participant_id} ({user.username}): {str(e)}'
                        ))
                        print(f"[ERROR] Failed to send Study End Survey & Monitor Return email to {participant.participant_id}: {str(e)}")
            else:
                skipped_count += 1
                if study_day == target_day:
                    self.stdout.write(self.style.WARNING(
                        f'  - Skipped: {participant.participant_id} ({user.username}) - {reason}'
                    ))

        # Summary
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS(f'\nSummary:'))
        self.stdout.write(f'  Eligible participants: {eligible_count}')
        if not check_only:
            self.stdout.write(f'  Emails sent: {sent_count}')
            self.stdout.write(f'  Errors: {error_count}')
        self.stdout.write(f'  Skipped: {skipped_count}')
        self.stdout.write('='*60 + '\n')
