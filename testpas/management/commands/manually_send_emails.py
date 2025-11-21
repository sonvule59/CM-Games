"""
Management command to manually send emails for testing purposes.
This bypasses the day checks and sends emails directly.
"""
from django.core.management.base import BaseCommand
from testpas.models import Participant, EmailTemplate
from django.conf import settings

class Command(BaseCommand):
    help = 'Manually send emails to participants for testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--template',
            type=str,
            required=True,
            help='Email template name to send (e.g., wave2_survey_ready, intervention_access_immediate)',
        )
        parser.add_argument(
            '--participant-id',
            type=str,
            help='Send to specific participant ID (if not provided, sends to all participants)',
        )
        parser.add_argument(
            '--group',
            type=int,
            choices=[0, 1],
            help='Send only to participants in this group (0=control, 1=intervention)',
        )

    def handle(self, *args, **options):
        template_name = options['template']
        participant_id = options.get('participant_id')
        group = options.get('group')
        
        # Check if template exists
        try:
            template = EmailTemplate.objects.get(name=template_name)
            self.stdout.write(self.style.SUCCESS(f'Email template "{template_name}" found.'))
        except EmailTemplate.DoesNotExist:
            self.stdout.write(self.style.ERROR(
                f'Email template "{template_name}" not found.\n'
                'Available templates: ' + ', '.join(EmailTemplate.objects.values_list('name', flat=True))
            ))
            return
        
        # Get participants
        if participant_id:
            participants = Participant.objects.filter(participant_id=participant_id)
            if not participants.exists():
                self.stdout.write(self.style.ERROR(f'Participant {participant_id} not found.'))
                return
        else:
            participants = Participant.objects.all()
        
        # Filter by group if specified
        if group is not None:
            participants = participants.filter(randomized_group=group)
        
        if not participants.exists():
            self.stdout.write(self.style.WARNING('No participants found matching criteria.'))
            return
        
        self.stdout.write(f'\nSending "{template_name}" email to {participants.count()} participant(s)...\n')
        
        success_count = 0
        error_count = 0
        
        for participant in participants:
            try:
                self.stdout.write(f'  Sending to {participant.participant_id} ({participant.user.username})...', ending=' ')
                participant.send_email(template_name, extra_context={'username': participant.user.username})
                self.stdout.write(self.style.SUCCESS('✓ Sent'))
                success_count += 1
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'✗ Failed: {str(e)}'))
                error_count += 1
        
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS(f'\nSummary: {success_count} sent, {error_count} failed\n'))
        self.stdout.write('='*60 + '\n')

