#!/usr/bin/env python
"""
Test script for Information 24 email sending and 2-block randomization
Run: python test_information_24_and_randomization.py
"""
import os
import sys
import django
from datetime import datetime, timedelta
import pytz
import time

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'testpas.settings')
django.setup()

# Use SMTP email backend for actual email sending
from django.conf import settings
if not hasattr(settings, '_TEST_EMAIL_BACKEND_SET'):
    # Use SMTP backend to actually send emails (not console)
    print(f"Using email backend: {settings.EMAIL_BACKEND}")
    print(f"Email host: {settings.EMAIL_HOST}")
    print(f"Email user: {settings.EMAIL_HOST_USER}")
    settings._TEST_EMAIL_BACKEND_SET = True

from django.contrib.auth.models import User
from testpas.models import Participant, UserSurveyProgress, Survey, EmailTemplate
from testpas.tasks import daily_timeline_check
from testpas.utils import get_current_time
from testpas.timeline import get_study_day
from testpas import settings

def create_test_participants_for_info24():
    """Create test participants set up for Day 120 to test Information 24"""
    print("\n" + "="*60)
    print("CREATING TEST PARTICIPANTS FOR INFORMATION 24")
    print("="*60)
    
    # Get or create survey
    survey, _ = Survey.objects.get_or_create(
        title="Eligibility Criteria",
        defaults={'description': 'Test survey for Information 24 testing'}
    )
    
    participants = []
    
    # Create 4 test participants
    for i in range(1, 5):
        username = f"test_info24_{i}"
        email = "sonlevu73@gmail.com"  # Send all test emails to this address
        
        # Create user
        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': email}
        )
        
        if created:
            user.set_password('testpass123')
            user.email = email  # Ensure email is set
            user.save()
            print(f"Created user: {username}")
        else:
            print(f"User already exists: {username}, updating...")
            user.email = email  # Update email to vuleson59@gmail.com
            user.save()
        
        # Create participant
        participant, created = Participant.objects.get_or_create(
            user=user,
            defaults={
                'participant_id': f'INFO24_{i:03d}',
                'age': 30 + i,
                'confirmation_token': f'token_info24_{i}',
                'is_confirmed': True,
                'email': email
            }
        )
        
        if not created:
            participant.participant_id = f'INFO24_{i:03d}'
            participant.email = email
            participant.save()
        
        # Set up UserSurveyProgress for Day 120
        # For time compression: Day 120 means 119 days have passed
        # If seconds_per_day = 10, then 119 * 10 = 1190 seconds ago
        now = get_current_time()
        day_1_date = now.date()
        
        # Set reference timestamp to be 119 days ago (for Day 120)
        if settings.TIME_COMPRESSION:
            seconds_per_day = getattr(settings, 'SECONDS_PER_DAY', 86400)
            reference_timestamp = now - timedelta(seconds=119 * seconds_per_day)
        else:
            reference_timestamp = now - timedelta(days=119)
        
        progress, created = UserSurveyProgress.objects.get_or_create(
            user=user,
            survey=survey,
            defaults={
                'eligible': True,
                'consent_given': True,
                'day_1': day_1_date,
                'timeline_reference_timestamp': reference_timestamp
            }
        )
        
        if not created:
            progress.day_1 = day_1_date
            progress.timeline_reference_timestamp = reference_timestamp
            progress.eligible = True
            progress.consent_given = True
            progress.save()
        
        # Verify study day
        study_day = get_study_day(
            progress.day_1,
            now=now,
            compressed=settings.TIME_COMPRESSION,
            seconds_per_day=getattr(settings, 'SECONDS_PER_DAY', 86400),
            reference_timestamp=progress.timeline_reference_timestamp
        )
        
        print(f"  Participant {participant.participant_id}: Study Day = {study_day}")
        participants.append(participant)
    
    return participants

def create_test_participants_for_randomization():
    """Create test participants set up for Day 29 to test randomization"""
    print("\n" + "="*60)
    print("CREATING TEST PARTICIPANTS FOR RANDOMIZATION")
    print("="*60)
    
    # Get or create survey
    survey, _ = Survey.objects.get_or_create(
        title="Eligibility Criteria",
        defaults={'description': 'Test survey for randomization testing'}
    )
    
    participants = []
    
    # Create 4 test participants for randomization
    for i in range(1, 5):
        username = f"test_rand_{i}"
        email = "sonlevu73@gmail.com"  # Send all test emails to this address
        
        # Create user
        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': email}
        )
        
        if created:
            user.set_password('testpass123')
            user.email = email  # Ensure email is set
            user.save()
            print(f"Created user: {username}")
        else:
            print(f"User already exists: {username}, updating...")
            user.email = email  # Update email to vuleson59@gmail.com
            user.save()
        
        # Create participant
        participant, created = Participant.objects.get_or_create(
            user=user,
            defaults={
                'participant_id': f'RAND_{i:03d}',
                'age': 30 + i,
                'confirmation_token': f'token_rand_{i}',
                'is_confirmed': True,
                'email': email,
                'randomization_completed': False,  # Reset for testing
                'randomized_group': None,
                'randomization_pair_id': None,
                'randomization_position': None
            }
        )
        
        if not created:
            participant.participant_id = f'RAND_{i:03d}'
            participant.email = email
            participant.randomization_completed = False
            participant.randomized_group = None
            participant.randomization_pair_id = None
            participant.randomization_position = None
            participant.save()
        
        # Set up UserSurveyProgress for Day 29
        now = get_current_time()
        day_1_date = now.date()
        
        # Set reference timestamp to be 28 days ago (for Day 29)
        if settings.TIME_COMPRESSION:
            seconds_per_day = getattr(settings, 'SECONDS_PER_DAY', 86400)
            reference_timestamp = now - timedelta(seconds=28 * seconds_per_day)
        else:
            reference_timestamp = now - timedelta(days=28)
        
        progress, created = UserSurveyProgress.objects.get_or_create(
            user=user,
            survey=survey,
            defaults={
                'eligible': True,
                'consent_given': True,
                'day_1': day_1_date,
                'timeline_reference_timestamp': reference_timestamp
            }
        )
        
        if not created:
            progress.day_1 = day_1_date
            progress.timeline_reference_timestamp = reference_timestamp
            progress.eligible = True
            progress.consent_given = True
            progress.save()
        
        # Verify study day
        study_day = get_study_day(
            progress.day_1,
            now=now,
            compressed=settings.TIME_COMPRESSION,
            seconds_per_day=getattr(settings, 'SECONDS_PER_DAY', 86400),
            reference_timestamp=progress.timeline_reference_timestamp
        )
        
        print(f"  Participant {participant.participant_id}: Study Day = {study_day}")
        participants.append(participant)
    
    return participants

def test_information_24(participants):
    """Test Information 24 email sending"""
    print("\n" + "="*60)
    print("TESTING INFORMATION 24 EMAIL SENDING")
    print("="*60)
    
    # Check if email template exists
    try:
        template = EmailTemplate.objects.get(name='study_end')
        print(f"✓ Email template 'study_end' found")
    except EmailTemplate.DoesNotExist:
        print("✗ ERROR: Email template 'study_end' not found!")
        print("  Run: python manage.py seed_email_template")
        return False
    
    # Reset email sent flags for testing
    for participant in participants:
        participant.wave3_survey_monitor_return_sent = False
        participant.wave3_survey_monitor_return_date = None
        participant.save()
        print(f"  Reset email flag for {participant.participant_id}")
    
    print(f"\nRunning timeline check for {len(participants)} participants...")
    print(f"All emails will be sent to: sonlevu73@gmail.com")
    print(f"Email backend: {settings.EMAIL_BACKEND}")
    print(f"Email host: {settings.EMAIL_HOST}")
    
    success_count = 0
    error_count = 0
    
    for participant in participants:
        user = participant.user
        print(f"\nProcessing {participant.participant_id} (Email: {participant.email or user.email})...")
        
        try:
            # Run timeline check
            daily_timeline_check(user)
            
            # Refresh from database
            participant.refresh_from_db()
            
            if participant.wave3_survey_monitor_return_sent:
                print(f"  ✓ Email sent successfully!")
                print(f"    Sent date: {participant.wave3_survey_monitor_return_date}")
                print(f"    Email should be in inbox: sonlevu73@gmail.com")
                success_count += 1
            else:
                print(f"  ✗ Email NOT sent (wave3_survey_monitor_return_sent = {participant.wave3_survey_monitor_return_sent})")
                error_count += 1
            
            # Add delay between emails to avoid rate limiting and email blocking
            print(f"  Waiting 3 seconds before next email...")
            time.sleep(3)
                
        except Exception as e:
            print(f"  ✗ ERROR: {str(e)}")
            import traceback
            print(traceback.format_exc())
            error_count += 1
            # Wait even on error to avoid rate limiting
            time.sleep(2)
    
    print(f"\n" + "="*60)
    print(f"Information 24 Test Results:")
    print(f"  Success: {success_count}/{len(participants)}")
    print(f"  Errors: {error_count}/{len(participants)}")
    print("="*60)
    
    return success_count == len(participants)

def test_randomization(participants):
    """Test 2-block randomization"""
    print("\n" + "="*60)
    print("TESTING 2-BLOCK RANDOMIZATION")
    print("="*60)
    
    print(f"\nInitial state - {len(participants)} participants:")
    for p in participants:
        print(f"  {p.participant_id}: Group={p.randomized_group}, Pair={p.randomization_pair_id}, Position={p.randomization_position}, Completed={p.randomization_completed}")
    
    print(f"\nRunning timeline check for randomization...")
    
    for participant in participants:
        user = participant.user
        print(f"\nProcessing {participant.participant_id}...")
        
        try:
            daily_timeline_check(user)
            participant.refresh_from_db()
            print(f"  Result: Group={participant.randomized_group}, Pair={participant.randomization_pair_id}, Position={participant.randomization_position}, Completed={participant.randomization_completed}")
        except Exception as e:
            print(f"  ✗ ERROR: {str(e)}")
            import traceback
            print(traceback.format_exc())
    
    # Show final state
    print(f"\nFinal state after randomization:")
    for p in participants:
        print(f"  {p.participant_id}: Group={p.randomized_group}, Pair={p.randomization_pair_id}, Position={p.randomization_position}")
    
    # Verify 2-block randomization
    print(f"\nVerifying 2-block randomization:")
    pairs = {}
    for p in participants:
        if p.randomization_pair_id:
            if p.randomization_pair_id not in pairs:
                pairs[p.randomization_pair_id] = []
            pairs[p.randomization_pair_id].append(p)
    
    all_correct = True
    for pair_id, pair_participants in pairs.items():
        if len(pair_participants) == 2:
            p1, p2 = pair_participants
            if p1.randomized_group is not None and p2.randomized_group is not None:
                if p1.randomized_group != p2.randomized_group:
                    print(f"  ✓ Pair {pair_id}: {p1.participant_id} (Group {p1.randomized_group}) vs {p2.participant_id} (Group {p2.randomized_group}) - CORRECT")
                else:
                    print(f"  ✗ Pair {pair_id}: {p1.participant_id} (Group {p1.randomized_group}) vs {p2.participant_id} (Group {p2.randomized_group}) - ERROR: Same group!")
                    all_correct = False
            else:
                print(f"  ✗ Pair {pair_id}: One or both participants not randomized")
                all_correct = False
        else:
            print(f"  ! Pair {pair_id}: Only {len(pair_participants)} participants (should be 2)")
            if len(pair_participants) == 1:
                p = pair_participants[0]
                if p.randomized_group is not None:
                    print(f"    Single participant {p.participant_id} randomized to Group {p.randomized_group} (waiting for pair)")
    
    # Check overall balance
    group_0_count = sum(1 for p in participants if p.randomized_group == 0)
    group_1_count = sum(1 for p in participants if p.randomized_group == 1)
    print(f"\nOverall balance:")
    print(f"  Group 0 (Control): {group_0_count} participants")
    print(f"  Group 1 (Intervention): {group_1_count} participants")
    print(f"  Ratio: {group_0_count}:{group_1_count}")
    
    if len(participants) >= 2 and group_0_count == group_1_count:
        print(f"  ✓ Perfect 1:1 ratio achieved!")
    elif len(participants) >= 2:
        print(f"  ⚠ Ratio not 1:1 (expected for incomplete pairs)")
    
    return all_correct

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("COMPREHENSIVE TEST: INFORMATION 24 + RANDOMIZATION")
    print("="*60)
    
    # Test Information 24
    info24_participants = create_test_participants_for_info24()
    info24_success = test_information_24(info24_participants)
    
    # Test Randomization
    rand_participants = create_test_participants_for_randomization()
    rand_success = test_randomization(rand_participants)
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    print(f"Information 24 Test: {'✓ PASSED' if info24_success else '✗ FAILED'}")
    print(f"Randomization Test: {'✓ PASSED' if rand_success else '✗ FAILED'}")
    print("="*60 + "\n")

if __name__ == '__main__':
    main()

