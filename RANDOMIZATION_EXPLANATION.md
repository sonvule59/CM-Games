# 2-Block Randomization Implementation Explanation

## Requirements

According to the requirements, the 2-block randomization procedure should:
1. **Randomize on Day 29**: Participants are randomized into Group 0 (control) or Group 1 (intervention) on Day 29
2. **Pair-based randomization**: Participants are randomized in pairs of two
3. **Fair coin flip for first participant**: The first person in each pair (earlier enrollment) is assigned randomly with equal chance (50/50)
4. **Opposite group for second participant**: The second person in the pair is automatically assigned to the opposite group
5. **Guaranteed 1:1 ratio**: After every two enrollments, there is a guaranteed 1:1 ratio between groups
6. **Notification on Day 29**: Participants are informed of their group assignment on Day 29

## How the Code Implements These Requirements

### 1. **Pair Assignment Logic** (Lines 168-195)

```python
if participant.randomization_pair_id is None:
    # Find the next available pair or create a new one
    last_pair = Participant.objects.filter(
        randomization_pair_id__isnull=False
    ).order_by('-randomization_pair_id').first()
    
    if last_pair is None:
        # First participant ever
        pair_id = 1
        position = 1
    else:
        # Check if the last pair is complete (has 2 participants)
        pair_participants = Participant.objects.filter(
            randomization_pair_id=last_pair.randomization_pair_id
        ).count()
        
        if pair_participants < 2:
            # Join the existing incomplete pair
            pair_id = last_pair.randomization_pair_id
            position = 2
        else:
            # Create a new pair
            pair_id = last_pair.randomization_pair_id + 1
            position = 1
```

**How it meets requirements:**
- Automatically assigns participants to pairs based on enrollment order
- First participant gets `position = 1`, second gets `position = 2`
- Ensures participants are always paired sequentially

### 2. **Enrollment Order Detection** (Line 200)

```python
pair_participants = Participant.objects.filter(
    randomization_pair_id=participant.randomization_pair_id
).order_by('id')  # Order by enrollment time (earlier ID = earlier enrollment)
```

**How it meets requirements:**
- Orders participants by database ID (which reflects enrollment time)
- First participant (lower ID) = earlier enrollment
- Second participant (higher ID) = later enrollment

### 3. **Fair Coin Flip for First Participant** (Line 245)

```python
# Fair coin flip for first participant
first_group = random.choice([0, 1])
second_group = 1 - first_group  # Opposite group
```

**How it meets requirements:**
- Uses Python's `random.choice([0, 1])` which provides equal probability (50/50)
- This is the "fair coin flip" requirement

### 4. **Opposite Group Assignment** (Line 246)

```python
second_group = 1 - first_group  # Opposite group
```

**How it meets requirements:**
- If first participant gets Group 0, second gets Group 1 (1 - 0 = 1)
- If first participant gets Group 1, second gets Group 0 (1 - 1 = 0)
- Guarantees opposite groups within each pair

### 5. **Guaranteed 1:1 Ratio** (Lines 248-259)

```python
# Assign groups
first_participant.randomized_group = first_group
second_participant.randomized_group = second_group
```

**How it meets requirements:**
- Since each pair always has one Group 0 and one Group 1
- After every two enrollments (one complete pair), ratio is exactly 1:1
- This is mathematically guaranteed, not just statistically likely

### 6. **Single Participant Handling** (Lines 297-327)

```python
elif len(pair_participants) == 1:
    # Only one participant in pair - randomize them now, second participant will get opposite when they join
    assigned_group = random.choice([0, 1])
    single_participant.randomized_group = assigned_group
```

**How it meets requirements:**
- Handles the case where only one participant has enrolled so far
- First participant gets randomized immediately (fair coin flip)
- When second participant joins, they automatically get the opposite group (lines 211-220)
- Ensures randomization happens on Day 29 even if pair isn't complete

### 7. **Day 29 Trigger** (Line 165)

```python
if today and today >= 29 and not participant.randomization_completed:
```

**How it meets requirements:**
- Randomization only happens on Day 29 or later
- Uses `>= 29` to catch up if timeline check runs after Day 29
- Prevents re-randomization with `randomization_completed` flag

### 8. **Email Notifications** (Lines 266-296)

```python
if first_participant.randomized_group == 0:
    first_participant.send_email("intervention_access_later", ...)
elif first_participant.randomized_group == 1:
    first_participant.send_email("intervention_access_immediate", ...)
```

**How it meets requirements:**
- Sends appropriate email based on group assignment
- Group 0 (control) gets "intervention_access_later" email
- Group 1 (intervention) gets "intervention_access_immediate" email
- Emails sent immediately after randomization on Day 29

## Example Flow

**Scenario: 4 participants enroll**

1. **Participant 1** (Day 29):
   - Assigned to Pair 1, Position 1
   - Only one in pair → Randomized to Group 0 (random choice)
   - Receives "intervention_access_later" email

2. **Participant 2** (Day 29):
   - Assigned to Pair 1, Position 2
   - Pair now complete → Automatically assigned to Group 1 (opposite of Participant 1)
   - Receives "intervention_access_immediate" email
   - **Result: Pair 1 = 1:1 ratio ✓**

3. **Participant 3** (Day 29):
   - Assigned to Pair 2, Position 1
   - Only one in pair → Randomized to Group 1 (random choice)
   - Receives "intervention_access_immediate" email

4. **Participant 4** (Day 29):
   - Assigned to Pair 2, Position 2
   - Pair now complete → Automatically assigned to Group 0 (opposite of Participant 3)
   - Receives "intervention_access_later" email
   - **Result: Pair 2 = 1:1 ratio ✓**

**Final Result:**
- Pair 1: Group 0, Group 1
- Pair 2: Group 1, Group 0
- **Overall: 2 Group 0, 2 Group 1 = Perfect 1:1 ratio ✓**

## Key Features
Participants are automatically assigned to pairs based on enrollment order. First participant in each pair gets truly random assignment. Second participant always gets opposite group, ensuring 1:1 ratio, then single participants get randomized immediately, don't wait for pair. If timeline check runs after Day 29, the website still randomizes correctly then ends appropriate emails based on group assignment.

## Potential Edge Cases Handled

1. **Single participant in pair**: Randomized immediately, second gets opposite when they join
2. **Timeline check runs late**: Uses `>= 29` to catch up if missed Day 29
3. **Multiple participants on same day**: Pairs are assigned sequentially
4. **Data inconsistency**: Fixes cases where `randomization_completed=True` but `randomized_group=None`

