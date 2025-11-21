"""
Management command to fix participants who have randomization_completed=True but randomized_group=None.
This can happen due to data inconsistencies or bugs.
"""
from django.core.management.base import BaseCommand
from testpas.models import Participant
import random

class Command(BaseCommand):
    help = 'Fix participants with randomization_completed=True but randomized_group=None'

    def add_arguments(self, parser):
        parser.add_argument(
            '--check-only',
            action='store_true',
            help='Only check which participants need fixing, do not fix them',
        )
        parser.add_argument(
            '--force-randomize',
            action='store_true',
            help='Force randomization even if randomization_completed is True',
        )

    def handle(self, *args, **options):
        check_only = options['check_only']
        force_randomize = options['force_randomize']
        
        # Find participants with the inconsistency
        if force_randomize:
            # Find all participants who need randomization
            participants = Participant.objects.filter(
                randomization_completed=False
            ) | Participant.objects.filter(
                randomization_completed=True,
                randomized_group__isnull=True
            )
        else:
            # Only find participants with the specific inconsistency
            participants = Participant.objects.filter(
                randomization_completed=True,
                randomized_group__isnull=True
            )
        
        if not participants.exists():
            self.stdout.write(self.style.SUCCESS('No participants found with randomization inconsistencies.'))
            return
        
        self.stdout.write(f'\nFound {participants.count()} participant(s) with randomization issues:\n')
        
        fixed_count = 0
        for participant in participants:
            self.stdout.write(f'  Participant: {participant.participant_id} (User: {participant.user.username})')
            self.stdout.write(f'    randomization_completed: {participant.randomization_completed}')
            self.stdout.write(f'    randomized_group: {participant.randomized_group}')
            self.stdout.write(f'    randomization_pair_id: {participant.randomization_pair_id}')
            self.stdout.write(f'    randomization_position: {participant.randomization_position}')
            
            if check_only:
                self.stdout.write(f'    [CHECK ONLY] Would fix this participant\n')
            else:
                # Fix the inconsistency
                if participant.randomization_completed and participant.randomized_group is None:
                    # Reset randomization_completed to allow re-randomization
                    participant.randomization_completed = False
                    participant.save()
                    self.stdout.write(self.style.SUCCESS(f'    ✓ Reset randomization_completed to False\n'))
                    fixed_count += 1
                elif not participant.randomization_completed and force_randomize:
                    # Randomly assign a group if forcing randomization
                    assigned_group = random.choice([0, 1])
                    participant.randomized_group = assigned_group
                    participant.group = assigned_group
                    participant.group_assigned = True
                    participant.randomization_completed = True
                    participant.save()
                    self.stdout.write(self.style.SUCCESS(f'    ✓ Assigned to Group {assigned_group}\n'))
                    fixed_count += 1
        
        if not check_only:
            self.stdout.write(self.style.SUCCESS(f'\nFixed {fixed_count} participant(s).'))
            self.stdout.write('\nNote: Participants with reset randomization_completed will be randomized on the next Day 29 check.')
            self.stdout.write('      If you need immediate randomization, use --force-randomize flag.')
        else:
            self.stdout.write(f'\n[CHECK ONLY] Would fix {participants.count()} participant(s).')

