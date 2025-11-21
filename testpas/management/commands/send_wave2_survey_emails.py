"""
Management command to send Wave 2 survey emails (Information 18) to participants on Day 57.
Can also be used to manually send emails to participants who should have received them.
"""
from django.core.management.base import BaseCommand
from testpas.models import Participant, EmailTemplate, UserSurveyProgress
from testpas.utils import get_current_time
from testpas.timeline import get_study_day
from testpas import settings
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Send Wave 2 survey emails (Information 18) to participants on Day 57'

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
            help='Override the day check - send to participants on this study day (default: 57)',
        )

    def handle(self, *args, **options):
        check_only = options['check_only']
        force = options['force']
        target_day = options.get('day', 57)
        
        # Check if email template exists
        try:
            template = EmailTemplate.objects.get(name='wave2_survey_ready')
            self.stdout.write(self.style.SUCCESS('Email template "wave2_survey_ready" found in database.'))
        except EmailTemplate.DoesNotExist:
            self.stdout.write(self.style.ERROR(
                'Email template "wave2_survey_ready" not found in database.\n'
                'Please run: python manage.py seed_email_template'
            ))
            return
        
        # Get all participants
        participants = Participant.objects.all()
        self.stdout.write(f'Checking {participants.count()} participants...\n')
        
        eligible_participants = []
        skipped_participants = []
        
        for participant in participants:
            # Get user progress to calculate study day
            user_progress = UserSurveyProgress.objects.filter(
                user=participant.user,
                survey__title="Eligibility Criteria"
            ).first()
            
            if not user_progress or not user_progress.day_1:
                skipped_participants.append({
                    'participant': participant,
                    'reason': 'No user progress or day_1 not set'
                })
                continue
            
            # Calculate study day
            now = get_current_time()
            study_day = get_study_day(
                user_progress.day_1,
                now=now,
                compressed=settings.TIME_COMPRESSION,
                seconds_per_day=settings.SECONDS_PER_DAY,
                reference_timestamp=user_progress.timeline_reference_timestamp
            )
            
            # Check if participant should receive email
            should_send = False
            if force:
                # Force send if already on or past Day 57
                should_send = study_day >= target_day
            else:
                # Normal logic: Day 57 and not already sent
                should_send = study_day == target_day and not participant.wave2_survey_email_sent
            
            if should_send:
                eligible_participants.append({
                    'participant': participant,
                    'study_day': study_day,
                    'already_sent': participant.wave2_survey_email_sent
                })
            else:
                skipped_participants.append({
                    'participant': participant,
                    'reason': f'Study day: {study_day} (need {target_day}), already_sent: {participant.wave2_survey_email_sent}'
                })
        
        self.stdout.write(f'\nEligible participants: {len(eligible_participants)}')
        self.stdout.write(f'Skipped participants: {len(skipped_participants)}\n')
        
        if check_only:
            self.stdout.write('\nEligible participants (not sending):')
            for item in eligible_participants:
                p = item['participant']
                self.stdout.write(
                    f'  - {p.participant_id}: Study Day {item["study_day"]}, '
                    f'Email: {p.user.email}, Already sent: {item["already_sent"]}'
                )
            return
        
        # Send emails
        sent_count = 0
        failed_count = 0
        
        for item in eligible_participants:
            participant = item['participant']
            try:
                self.stdout.write(f'Sending email to {participant.participant_id} (Day {item["study_day"]})...')
                participant.send_email(
                    "wave2_survey_ready",
                    extra_context={
                        "username": participant.user.username,
                    }
                )
                participant.wave2_survey_email_sent = True
                participant.save()
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✓ Sent Wave 2 survey email to {participant.participant_id} '
                        f'({participant.user.email})'
                    )
                )
                sent_count += 1
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f'✗ Failed to send email to {participant.participant_id}: {str(e)}'
                    )
                )
                logger.error(f"Failed to send Wave 2 survey email to {participant.participant_id}: {str(e)}")
                failed_count += 1
        
        self.stdout.write('\n' + '='*60)
        self.stdout.write(
            self.style.SUCCESS(
                f'\nSummary: {sent_count} emails sent, {failed_count} failed'
            )
        )
