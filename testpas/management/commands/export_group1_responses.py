"""
Management command to export all intervention responses from Group 1 participants to CSV.
Usage: python manage.py export_group1_responses [--output filename.csv]
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from testpas.models import Participant, InterventionResponse, ChallengeCompletion
import csv
import json
from datetime import datetime


class Command(BaseCommand):
    help = 'Export all intervention responses from Group 1 participants to CSV'

    def add_arguments(self, parser):
        parser.add_argument(
            '--output',
            type=str,
            default='group1_intervention_responses.csv',
            help='Output CSV filename (default: group1_intervention_responses.csv)'
        )
        parser.add_argument(
            '--include-completions',
            action='store_true',
            help='Include challenge completions in the export'
        )

    def handle(self, *args, **options):
        output_file = options['output']
        include_completions = options['include_completions']
        
        # Get all Group 1 participants
        group1_participants = Participant.objects.filter(randomized_group=1)
        
        if not group1_participants.exists():
            self.stdout.write(self.style.WARNING('No Group 1 participants found.'))
            return
        
        self.stdout.write(f'Found {group1_participants.count()} Group 1 participants')
        
        # Collect all responses
        all_responses = []
        
        # Get InterventionResponse records
        intervention_responses = InterventionResponse.objects.filter(
            participant__randomized_group=1
        ).select_related('user', 'participant').order_by('created_at')
        
        self.stdout.write(f'Found {intervention_responses.count()} intervention responses')
        
        for response in intervention_responses:
            all_responses.append({
                'participant_id': response.participant.participant_id,
                'username': response.user.username,
                'email': response.user.email,
                'response_type': response.get_response_type_display(),
                'challenge_number': response.challenge_number or '',
                'challenge_name': response.challenge_name or '',
                'response_data': json.dumps(response.response_data) if response.response_data else '',
                'notes': response.notes or '',
                'created_at': response.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'ip_address': str(response.ip_address) if response.ip_address else '',
            })
        
        # Optionally include challenge completions
        if include_completions:
            completions = ChallengeCompletion.objects.filter(
                participant__randomized_group=1
            ).select_related('user', 'participant').order_by('completed_at')
            
            self.stdout.write(f'Found {completions.count()} challenge completions')
            
            for completion in completions:
                all_responses.append({
                    'participant_id': completion.participant.participant_id,
                    'username': completion.user.username,
                    'email': completion.user.email,
                    'response_type': 'Challenge Completion',
                    'challenge_number': completion.challenge_number,
                    'challenge_name': completion.challenge_name,
                    'response_data': '',
                    'notes': '',
                    'created_at': completion.completed_at.strftime('%Y-%m-%d %H:%M:%S'),
                    'ip_address': '',
                })
        
        # Write to CSV
        if all_responses:
            fieldnames = [
                'participant_id', 'username', 'email', 'response_type',
                'challenge_number', 'challenge_name', 'response_data',
                'notes', 'created_at', 'ip_address'
            ]
            
            with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(all_responses)
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully exported {len(all_responses)} responses to {output_file}'
                )
            )
        else:
            self.stdout.write(self.style.WARNING('No responses to export.'))

