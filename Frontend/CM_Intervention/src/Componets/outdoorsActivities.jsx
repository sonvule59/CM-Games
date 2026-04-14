import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { rcStyles } from '../Static/rockClimbingStyles';
import { ActionPanel } from './ActionPanel.tsx';
import { statsUpdate, StatsPanel } from './StatsPanel.tsx';
import pullingUpLakeImg from '../images/pullingUpLake.png';
import walkingLakeImg from '../images/walkingLake.png';
import guyFishingImg from '../images/guyFishing.png';
import catchFishImg from '../images/catchFish.png';
import golfingImg from '../images/golfing.png';
import bocceBallImg from '../images/bocceBall.png';

/**
 * OutdoorsActivities: a simple, choice-based mini‑game set at a lakeside park.
 * Start by "pulling up to the lake", then choose an activity (walk, fish, golf, bocce),
 * and explore two small follow‑up situations for each one.
 */
export default function OutdoorsActivities() {
  const navigate = useNavigate();

  const initialStats = {
    confidence: 50,
    mood: 50,
    mobility: 50,
    energy: 100,
  };

  const [activity, setActivity] = useState(null); // 'walk' | 'fish' | 'golf' | 'bocce' | null
  const [step, setStep] = useState('intro'); // 'intro' | 'activityIntro' | 'activityChoice' | 'result'
  const [resultText, setResultText] = useState('');
  const [stats, setStats] = useState(initialStats);

  const OUTDOOR_IMAGES = {
    lake: pullingUpLakeImg,
    walk: walkingLakeImg,
    fish: guyFishingImg,
    catchFish: catchFishImg,
    golf: golfingImg,
    bocce: bocceBallImg,
  };

  const handleSelectActivity = (nextActivity) => {
    setActivity(nextActivity);
    setStep('activityIntro');
    setResultText('');
    if (nextActivity === 'walk') {
      applyDelta({ confidence: +2, mood: +3, mobility: +4, energy: -2 });
    } else if (nextActivity === 'fish') {
      applyDelta({ confidence: +2, mood: +4, mobility: +1, energy: -1 });
    } else if (nextActivity === 'golf') {
      applyDelta({ confidence: +4, mood: +2, mobility: +2, energy: -3 });
    } else if (nextActivity === 'bocce') {
      applyDelta({ confidence: +3, mood: +5, mobility: +2, energy: -2 });
    }
  };

  const applyDelta = (delta) => {
    setStats((prev) =>
      statsUpdate(prev, {
        confidence: delta.confidence ?? 0,
        mood: delta.mood ?? 0,
        mobility: delta.mobility ?? 0,
        energy: delta.energy ?? 0,
      }),
    );
  };

  const backToLake = () => {
    setActivity(null);
    setStep('intro');
    setResultText('');
    setStats(initialStats);
  };

  const goToChoices = () => {
    setStep('activityChoice');
  };

  const handleFishingChoice = (choice) => {
    if (choice === 'catch') {
      applyDelta({ confidence: +8, mood: +5, mobility: +2, energy: -5 });
      setResultText(
        'You cast your line and feel a steady tug. After a quiet moment of waiting, you reel in a fish and take a second to enjoy the view before deciding what comes next.'
      );
    } else if (choice === 'back') {
      applyDelta({ confidence: +2, mood: +4, mobility: +1, energy: +2 });
      setResultText(
        'You enjoy the gentle sounds of the water for a bit, then decide to head back to the shoreline, feeling relaxed and ready for the rest of the day.'
      );
    }
    setStep('result');
  };

  // You can adjust these later if you want different situations.
  const handleWalkChoice = (choice) => {
    if (choice === 'short') {
      applyDelta({ confidence: +3, mood: +5, mobility: +4, energy: -2 });
      setResultText(
        'You choose a shorter loop along the water, noticing birds, trees, and the way the light hits the lake. It feels like just enough movement to clear your head.'
      );
    } else if (choice === 'long') {
      applyDelta({ confidence: +5, mood: +6, mobility: +8, energy: -6 });
      setResultText(
        'You follow a longer trail that winds through the trees. You take your time, stop for a few photos, and return feeling refreshed and grounded.'
      );
    }
    setStep('result');
  };

  const handleGolfChoice = (choice) => {
    if (choice === 'drives') {
      applyDelta({ confidence: +6, mood: +3, mobility: +2, energy: -5 });
      setResultText(
        'You focus on easy, smooth swings at the driving range. Instead of chasing perfection, you enjoy the rhythm of each shot and the wide‑open sky.'
      );
    } else if (choice === 'shortGame') {
      applyDelta({ confidence: +4, mood: +4, mobility: +1, energy: -3 });
      setResultText(
        'You practice gentle putts and chips on the green. The slower pace lets you notice small improvements and enjoy being outside.'
      );
    }
    setStep('result');
  };

  const handleBocceChoice = (choice) => {
    if (choice === 'casual') {
      applyDelta({ confidence: +4, mood: +7, mobility: +2, energy: -2 });
      setResultText(
        'You play a relaxed round of bocce with friends, laughing at wild throws and cheering for close shots. The game becomes more about connection than keeping score.'
      );
    } else if (choice === 'tournament') {
      applyDelta({ confidence: +6, mood: +6, mobility: +3, energy: -4 });
      setResultText(
        'You set up a friendly mini‑tournament, taking turns and celebrating each win with high‑fives. The light competition adds excitement without pressure.'
      );
    }
    setStep('result');
  };

  const renderIntro = () => (
    <div className={rcStyles.section}>
      <h2 className={rcStyles.title}>Pulling Up to the Lake</h2>
      <p className={rcStyles.paragraph}>
        Looking around, you notice a few options that all sound appealing. There&apos;s a trail that
        winds around the shoreline, people fishing quietly from a dock, a small golf area, and a spot
        set up for bocce ball.
      </p>
      <p className={rcStyles.paragraph}>
        There&apos;s no right or wrong choice here&mdash;just pick what feels interesting for you
        today.
      </p>
      <ActionPanel
        tasks={[
          {
            id: 'act-walk',
            label: 'Walk a lakeside trail',
            action: () => handleSelectActivity('walk'),
          },
          {
            id: 'act-fish',
            label: 'Fish at the lake',
            action: () => handleSelectActivity('fish'),
          },
          {
            id: 'act-golf',
            label: 'Play a little golf',
            action: () => handleSelectActivity('golf'),
          },
          {
            id: 'act-bocce',
            label: 'Play bocce ball',
            action: () => handleSelectActivity('bocce'),
          },
        ]}
      />
    </div>
  );

  const renderActivityIntro = () => {
    if (!activity) return null;

    let title = '';
    let body = '';

    if (activity === 'fish') {
      title = 'Settling in to Fish';
      body =
        'You walk down to the dock, set up your gear, and watch the ripples on the surface of the water. You have time to decide how you want this moment to feel.';
    } else if (activity === 'walk') {
      title = 'Starting Your Walk';
      body =
        'You step onto the trail and feel the ground under your feet. The path curves gently along the lake, with quiet spots to pause and look around.';
    } else if (activity === 'golf') {
      title = 'Heading to the Golf Area';
      body =
        'You make your way to the practice area, spotting a few open spots to hit some balls and maybe work on a part of your game that sounds fun today.';
    } else if (activity === 'bocce') {
      title = 'Setting Up Bocce';
      body =
        'You walk over to the bocce court, noticing the smooth ground and open space. It feels like a good place for a relaxed, playful game.';
    }

    return (
      <div className={rcStyles.section}>
        <h2 className={rcStyles.title}>{title}</h2>
        <p className={rcStyles.paragraph}>{body}</p>
        <ActionPanel
          tasks={[
            {
              id: 'intro-continue',
              className: rcStyles.primaryButton,
              label: 'Continue',
              action: goToChoices,
            },
            {
              id: 'intro-back',
              className: rcStyles.secondaryButton,
              label: 'Back to the lake options',
              action: backToLake,
            },
          ]}
        />
      </div>
    );
  };

  const renderActivityChoices = () => {
    if (!activity) return null;

    if (activity === 'fish') {
      return (
        <div className={rcStyles.section}>
          <h2 className={rcStyles.title}>How do you want to fish?</h2>
          <p className={rcStyles.paragraph}>
            You have your line ready and the water is calm. You can lean into the moment or keep it
            brief, depending on what feels best.
          </p>
          <ActionPanel
            tasks={[
              {
                id: 'fish-catch',
                label: 'Try to catch a fish',
                action: () => handleFishingChoice('catch'),
              },
              {
                id: 'fish-back',
                label: 'Sit for a bit, then head back',
                action: () => handleFishingChoice('back'),
              },
            ]}
          />
        </div>
      );
    }

    if (activity === 'walk') {
      return (
        <div className={rcStyles.section}>
          <h2 className={rcStyles.title}>Choosing your walk</h2>
          <p className={rcStyles.paragraph}>
            You look down the shoreline and see paths of different lengths. Both options can be a
            good fit&mdash;it just depends on what your body is asking for today.
          </p>
          <ActionPanel
            tasks={[
              {
                id: 'walk-short',
                label: 'Take a shorter, slower loop',
                action: () => handleWalkChoice('short'),
              },
              {
                id: 'walk-long',
                label: 'Explore a longer trail',
                action: () => handleWalkChoice('long'),
              },
            ]}
          />
        </div>
      );
    }

    if (activity === 'golf') {
      return (
        <div className={rcStyles.section}>
          <h2 className={rcStyles.title}>How do you want to play?</h2>
          <p className={rcStyles.paragraph}>
            You have access to a simple practice area. You can keep things light and playful while
            focusing on one part of your swing.
          </p>
          <ActionPanel
            tasks={[
              {
                id: 'golf-drives',
                label: 'Hit some easy drives',
                action: () => handleGolfChoice('drives'),
              },
              {
                id: 'golf-short',
                label: 'Practice your short game',
                action: () => handleGolfChoice('shortGame'),
              },
            ]}
          />
        </div>
      );
    }

    if (activity === 'bocce') {
      return (
        <div className={rcStyles.section}>
          <h2 className={rcStyles.title}>Setting the vibe for bocce</h2>
          <p className={rcStyles.paragraph}>
            You&apos;ve got the court, the balls, and some people who are up for a game. You can keep
            it as relaxed or as structured as you want.
          </p>
          <ActionPanel
            tasks={[
              {
                id: 'bocce-casual',
                label: 'Play a casual, low‑key game',
                action: () => handleBocceChoice('casual'),
              },
              {
                id: 'bocce-tourney',
                label: 'Make a tiny, friendly tournament',
                action: () => handleBocceChoice('tournament'),
              },
            ]}
          />
        </div>
      );
    }

    return null;
  };

  const renderResult = () => (
    <div className={rcStyles.section}>
      <h2 className={rcStyles.title}>How it plays out</h2>
      <p className={rcStyles.paragraph}>{resultText}</p>
      <ActionPanel
        tasks={[
          {
            id: 'result-back',
            className: rcStyles.secondaryButton,
            label: 'Back to the lake options',
            action: backToLake,
          },
        ]}
      />
    </div>
  );

  let imageKey = 'lake';
  if (activity === 'walk') {
    imageKey = 'walk';
  } else if (activity === 'fish') {
    imageKey = step === 'result' ? 'catchFish' : 'fish';
  } else if (activity === 'golf') {
    imageKey = 'golf';
  } else if (activity === 'bocce') {
    imageKey = 'bocce';
  }

  return (
    <div className={rcStyles.container}>
      <div className={rcStyles.header}>
        <div className={rcStyles.headerLeft}>
          <h1 className={rcStyles.mainTitle}>Day at the Lake</h1>
          <p className={rcStyles.headerSubtitle}>
            Choose how you&apos;d like to spend time outdoors&mdash;each path gives you a slightly
            different way to enjoy the day.
          </p>
        </div>
        <button
          className={rcStyles.secondaryButton}
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>

      <div className={rcStyles.sceneImageWrap}>
        <img
          src={OUTDOOR_IMAGES[imageKey]}
          alt=""
          className={rcStyles.sceneImage}
        />
      </div>

      <div className={rcStyles.topRow}>
        <StatsPanel stats={stats} />
      </div>

      {step === 'intro' && renderIntro()}
      {step === 'activityIntro' && renderActivityIntro()}
      {step === 'activityChoice' && renderActivityChoices()}
      {step === 'result' && renderResult()}
    </div>
  );
}

