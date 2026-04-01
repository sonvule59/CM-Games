// RockClimbing: a small choice-based mini‑game set in a climbing gym.
// This component owns the narrative flow and stat logic; layout / visuals
// are handled via Tailwind utility sets in `rockClimbingStyles`.
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import enteringGymImg from '../images/enteringGym.png';
import climbingWallImg from '../images/climbingWall.png';
import whichRouteImg from '../images/whichRoute.png';
import watchingClimbersImg from '../images/watchingClimbers.png';
import stretchingMatsImg from '../images/stretchingMats.png';
import warmupHoldsImg from '../images/warmupHolds.png';
import cheerOnImg from '../images/cheerOn.png';
import askRoutesImg from '../images/askRoutes.png';
import gentleMobilityImg from '../images/gentleMobility.png';
import hardRouteImg from '../images/hardRoute.png';
import { rcStyles } from '../Static/rockClimbingStyles';

// Map scene/response keys to illustration assets shown above the text.
const SCENE_IMAGES = {
  entrance: enteringGymImg,
  whichRoute: whichRouteImg,
  climbingWall: climbingWallImg,
  hardRoute: hardRouteImg,
  watch: watchingClimbersImg,
  cheerOn: cheerOnImg,
  askRoutes: askRoutesImg,
  stretchingMats: stretchingMatsImg,
  gentleMobility: gentleMobilityImg,
  warmupHolds: warmupHoldsImg,
};

// Short labels used in the header pill to describe the current scene.
const SCENE_LABELS = {
  entrance: 'Arriving at the gym',
  wall: 'On the wall',
  watch: 'Watching and learning',
  stretch: 'Warming up & stretching',
};

export default function RockClimbing() {
  const navigate = useNavigate();

  // All four stats live on a 0‑100 scale and are clamped on update.
  const initialStats = {
    confidence: 50,
    mood: 50,
    health: 50,
    energy: 100,
  };

  const [stats, setStats] = useState(initialStats);
  // scene drives which branch of the story is active.
  const [scene, setScene] = useState('entrance'); // 'entrance' | 'wall' | 'watch' | 'stretch'
  // step is a small state machine inside each scene (intro → choices → result).
  const [step, setStep] = useState(0); // 0 = entrance, 1 = path intro, 2 = path follow-up choices, 3 = path follow-up result
  const [lastDelta, setLastDelta] = useState({
    confidence: 0,
    mood: 0,
    health: 0,
    energy: 0,
  });
  const [resultText, setResultText] = useState('');
  const [stretchChoice, setStretchChoice] = useState(null); // 'mobility' | 'easyHolds' | null
  const [watchChoice, setWatchChoice] = useState(null); // 'cheer' | 'ask' | null
  const [wallChoice, setWallChoice] = useState(null); // 'easy' | 'hard' | null

  // Enforce 0‑100 range so bars and numbers never overflow.
  const clamp = (value) => Math.max(0, Math.min(100, value));

  // Apply stat changes in one place; any missing fields default to 0.
  const applyDelta = (delta) => {
    setStats((prev) => ({
      confidence: clamp(prev.confidence + (delta.confidence || 0)),
      mood: clamp(prev.mood + (delta.mood || 0)),
      health: clamp(prev.health + (delta.health || 0)),
      energy: clamp(prev.energy + (delta.energy || 0)),
    }));
    setLastDelta({
      confidence: delta.confidence || 0,
      mood: delta.mood || 0,
      health: delta.health || 0,
      energy: delta.energy || 0,
    });
  };

  // Hard reset back to the entrance with baseline stats.
  const resetGame = () => {
    setStats(initialStats);
    setScene('entrance');
    setStep(0);
    setLastDelta({ confidence: 0, mood: 0, health: 0, energy: 0 });
    setResultText('');
    setStretchChoice(null);
    setWatchChoice(null);
    setWallChoice(null);
  };

  // Soft reset used by "Back to Entrance" buttons after a branch.
  const backToEntrance = () => {
    setScene('entrance');
    setStep(0);
    setLastDelta({ confidence: 0, mood: 0, health: 0, energy: 0 });
    setResultText('');
    setStretchChoice(null);
    setWatchChoice(null);
    setWallChoice(null);
  };

  // Handle the very first choice from the entrance and move into a branch.
  const handleEntranceChoice = (choice) => {
    if (choice === 'wall') {
      applyDelta({ confidence: +8, mood: +5, health: +5, energy: -10 });
      setScene('wall');
    } else if (choice === 'watch') {
      applyDelta({ confidence: +4, mood: +6, health: 0, energy: -2 });
      setScene('watch');
    } else if (choice === 'stretch') {
      applyDelta({ confidence: +3, mood: +5, health: +10, energy: -3 });
      setScene('stretch');
    }
    setStep(1);
    setResultText('');
  };

  // Wall follow‑ups: easier vs harder route trades energy vs confidence.
  const handleWallFollowup = (choice) => {
    setWallChoice(choice);
    if (choice === 'easy') {
      applyDelta({ confidence: +6, mood: +4, health: +3, energy: -5 });
      setResultText(
        'You pick a friendlier route, focusing on smooth movement and breathing. Each hold feels more approachable, and you notice small wins stacking up.'
      );
    } else if (choice === 'hard') {
      applyDelta({ confidence: +10, mood: +3, health: +2, energy: -12 });
      setResultText(
        'You step onto the harder route, taking your time and honoring where your body is today. Every attempt is valid effort, and you celebrate the courage it took to try.'
      );
    }
    setStep(3);
  };

  // Watching follow‑ups: social choices that mostly affect mood / confidence.
  const handleWatchFollowup = (choice) => {
    setWatchChoice(choice);
    if (choice === 'cheer') {
      applyDelta({ confidence: +5, mood: +8, health: 0, energy: -1 });
      setResultText(
        'You cheer for another climber, noticing how their effort inspires you. The room feels warmer and more connected, and you feel proud of the support you offered.'
      );
    } else if (choice === 'ask') {
      applyDelta({ confidence: +7, mood: +4, health: +2, energy: -2 });
      setResultText(
        'You talk with staff about beginner routes, getting clear, kind guidance. Knowing there are options that meet you where you are makes the wall feel less intimidating.'
      );
    }
    setStep(3);
  };

  // Stretch follow‑ups: mobility vs easy climbing warm‑up, both supportive.
  const handleStretchFollowup = (choice) => {
    setStretchChoice(choice);
    if (choice === 'mobility') {
      applyDelta({ confidence: +4, mood: +6, health: +12, energy: -3 });
      setResultText(
        'You move gently through your joints, paying attention to what feels good. Each stretch is a small act of care, reminding you that comfort matters as much as challenge.'
      );
    } else if (choice === 'easyHolds') {
      applyDelta({ confidence: +7, mood: +7, health: +8, energy: -6 });
      setResultText(
        'You warm up on easier holds, letting your body find its rhythm. The movements stay light and playful, and you notice tension slowly drifting away.'
      );
    }
    setStep(3);
  };

  // Render a small list summarizing the most recent stat changes.
  const renderDeltaList = () => {
    const items = [];
    const labels = {
      confidence: 'Confidence',
      mood: 'Mood',
      health: 'Health',
      energy: 'Energy',
    };

    Object.keys(lastDelta).forEach((key) => {
      const value = lastDelta[key];
      if (!value) return;
      const sign = value > 0 ? '+' : '';
      items.push(
        <li key={key} className={rcStyles.deltaItem}>
          {sign}
          {value} {labels[key]}
        </li>
      );
    });

    if (items.length === 0) {
      return <li className={rcStyles.deltaItem}>No recent changes.</li>;
    }

    return items;
  };

  // Single horizontal stat bar row; color is passed per stat.
  const renderStatsBar = (label, value, color, isPrimary = false) => {
    return (
      <div className={isPrimary ? rcStyles.statRowPrimary : rcStyles.statRow}>
        <div className={isPrimary ? rcStyles.statLabelPrimary : rcStyles.statLabel}>{label}</div>
        <div className={isPrimary ? rcStyles.barOuterPrimary : rcStyles.barOuter}>
          <div
            className={rcStyles.barInner}
            style={{ width: `${value}%`, backgroundColor: color }}
          />
        </div>
        <div className={isPrimary ? rcStyles.statValuePrimary : rcStyles.statValue}>{value}</div>
      </div>
    );
  };

  const renderSceneContent = () => {
    if (scene === 'entrance') {
      return (
        <div className={rcStyles.section}>
          <h2 className={rcStyles.title}>Climbing Gym Entrance</h2>
          <p className={rcStyles.paragraph}>
            You enter the climbing gym and take in the sound of chalk bags, friendly chatter, and shoes
            squeaking on the mats. Today, your goal is simply to notice what feels right for your body and
            energy, without judgment.
          </p>
          <div className={rcStyles.buttonGroup}>
            <button
              className={rcStyles.button}
              onClick={() => handleEntranceChoice('wall')}
            >
              Hop on the wall
            </button>
            <button
              className={rcStyles.button}
              onClick={() => handleEntranceChoice('watch')}
            >
              Sit and watch
            </button>
            <button
              className={rcStyles.button}
              onClick={() => handleEntranceChoice('stretch')}
            >
              Go stretch and warm up
            </button>
          </div>
        </div>
      );
    }

    if (scene === 'wall') {
      if (step === 1) {
        return (
          <div className={rcStyles.section}>
            <h2 className={rcStyles.title}>On the Wall</h2>
            <p className={rcStyles.paragraph}>
              You clip your shoes, chalk up, and place your hands on the holds. You don’t need to climb your
              hardest; you’re allowed to explore what feels steady and kind to your body today.
            </p>
            <p className={rcStyles.paragraph}>
              Each move is a chance to listen to your breathing and notice your strength without labeling it
              as “good” or “bad.”
            </p>
            <div className={rcStyles.deltaContainer}>
              <h3 className={rcStyles.subtitle}>Recent changes</h3>
              <ul className={rcStyles.deltaList}>{renderDeltaList()}</ul>
            </div>
            <button className={rcStyles.primaryButton} onClick={() => setStep(2)}>
              Continue
            </button>
          </div>
        );
      }

      if (step === 2) {
        return (
          <div className={rcStyles.section}>
            <h2 className={rcStyles.title}>Choosing a Route</h2>
            <p className={rcStyles.paragraph}>
              Looking at the wall, you notice both gentler lines and more demanding climbs. You’re free to
              choose what fits your capacity right now, without needing to prove anything.
            </p>
            <div className={rcStyles.buttonGroup}>
              <button
                className={rcStyles.button}
                onClick={() => handleWallFollowup('easy')}
              >
                Try an easier route
              </button>
              <button
                className={rcStyles.button}
                onClick={() => handleWallFollowup('hard')}
              >
                Try a harder route
              </button>
            </div>
          </div>
        );
      }

      if (step === 3) {
        return (
          <div className={rcStyles.section}>
            <h2 className={rcStyles.title}>On the Wall – Afterward</h2>
            <p className={rcStyles.paragraph}>{resultText}</p>
            <div className={rcStyles.deltaContainer}>
              <h3 className={rcStyles.subtitle}>Recent changes</h3>
              <ul className={rcStyles.deltaList}>{renderDeltaList()}</ul>
            </div>
            <button className={rcStyles.secondaryButton} onClick={backToEntrance}>
              Back to Entrance
            </button>
          </div>
        );
      }
    }

    if (scene === 'watch') {
      if (step === 1) {
        return (
          <div className={rcStyles.section}>
            <h2 className={rcStyles.title}>Watching from the Mats</h2>
            <p className={rcStyles.paragraph}>
              You settle onto the mats and watch climbers move in all sorts of bodies and styles. Some move
              quickly, some slowly, and none of them need to look a certain way to belong here.
            </p>
            <p className={rcStyles.paragraph}>
              Observing from a distance gives you space to notice what feels interesting or inviting without
              pressure to join in right away.
            </p>
            <div className={rcStyles.deltaContainer}>
              <h3 className={rcStyles.subtitle}>Recent changes</h3>
              <ul className={rcStyles.deltaList}>{renderDeltaList()}</ul>
            </div>
            <button className={rcStyles.primaryButton} onClick={() => setStep(2)}>
              Continue
            </button>
          </div>
        );
      }

      if (step === 2) {
        return (
          <div className={rcStyles.section}>
            <h2 className={rcStyles.title}>Connecting from the Sidelines</h2>
            <p className={rcStyles.paragraph}>
              As you keep watching, you notice chances to connect—either by offering encouragement or asking
              for guidance. Both are valid, grounded ways to participate.
            </p>
            <div className={rcStyles.buttonGroup}>
              <button
                className={rcStyles.button}
                onClick={() => handleWatchFollowup('cheer')}
              >
                Cheer someone on
              </button>
              <button
                className={rcStyles.button}
                onClick={() => handleWatchFollowup('ask')}
              >
                Ask staff about beginner routes
              </button>
            </div>
          </div>
        );
      }

      if (step === 3) {
        return (
          <div className={rcStyles.section}>
            <h2 className={rcStyles.title}>Watching – Afterward</h2>
            <p className={rcStyles.paragraph}>{resultText}</p>
            <div className={rcStyles.deltaContainer}>
              <h3 className={rcStyles.subtitle}>Recent changes</h3>
              <ul className={rcStyles.deltaList}>{renderDeltaList()}</ul>
            </div>
            <button className={rcStyles.secondaryButton} onClick={backToEntrance}>
              Back to Entrance
            </button>
          </div>
        );
      }
    }

    if (scene === 'stretch') {
      if (step === 1) {
        return (
          <div className={rcStyles.section}>
            <h2 className={rcStyles.title}>Stretching and Warming Up</h2>
            <p className={rcStyles.paragraph}>
              You find a quiet spot and start with simple movements—rolling your shoulders, circling your
              wrists, and gently waking up your legs.
            </p>
            <p className={rcStyles.paragraph}>
              Instead of chasing “perfect form,” you focus on what feels supportive, letting your body set
              the pace and depth of each stretch.
            </p>
            <div className={rcStyles.deltaContainer}>
              <h3 className={rcStyles.subtitle}>Recent changes</h3>
              <ul className={rcStyles.deltaList}>{renderDeltaList()}</ul>
            </div>
            <button className={rcStyles.primaryButton} onClick={() => setStep(2)}>
              Continue
            </button>
          </div>
        );
      }

      if (step === 2) {
        return (
          <div className={rcStyles.section}>
            <h2 className={rcStyles.title}>Choosing How to Warm Up</h2>
            <p className={rcStyles.paragraph}>
              You consider whether your body would appreciate more gentle mobility or whether it might feel
              good to move onto very easy holds. Either option is a valid way to care for yourself.
            </p>
            <div className={rcStyles.buttonGroup}>
              <button
                className={rcStyles.button}
                onClick={() => handleStretchFollowup('mobility')}
              >
                Do gentle mobility work
              </button>
              <button
                className={rcStyles.button}
                onClick={() => handleStretchFollowup('easyHolds')}
              >
                Warm up on the easy holds
              </button>
            </div>
          </div>
        );
      }

      if (step === 3) {
        return (
          <div className={rcStyles.section}>
            <h2 className={rcStyles.title}>Stretching – Afterward</h2>
            <p className={rcStyles.paragraph}>{resultText}</p>
            <div className={rcStyles.deltaContainer}>
              <h3 className={rcStyles.subtitle}>Recent changes</h3>
              <ul className={rcStyles.deltaList}>{renderDeltaList()}</ul>
            </div>
            <button className={rcStyles.secondaryButton} onClick={backToEntrance}>
              Back to Entrance
            </button>
          </div>
        );
      }
    }

    return null;
  };

  // Pick image to show for current scene/step/choice (entrance, wall, watch, stretch paths).
  const sceneImageKey =
    scene === 'entrance'
      ? 'entrance'
      : scene === 'wall'
        ? step === 1
          ? 'whichRoute'
          : step === 3 && wallChoice === 'hard'
            ? 'hardRoute'
            : 'climbingWall'
        : scene === 'watch'
          ? step === 3 && watchChoice === 'cheer'
            ? 'cheerOn'
            : step === 3 && watchChoice === 'ask'
              ? 'askRoutes'
              : 'watch'
          : scene === 'stretch'
            ? step === 3 && stretchChoice === 'mobility'
              ? 'gentleMobility'
              : step === 3 && stretchChoice === 'easyHolds'
                ? 'warmupHolds'
                : 'stretchingMats'
            : 'entrance';

  return (
    <div className={rcStyles.container}>
      <div className={rcStyles.header}>
        <div className={rcStyles.headerLeft}>
          <h1 className={rcStyles.mainTitle}>Rock Climbing Gym</h1>
          <p className={rcStyles.headerSubtitle}>
            Choose what feels right for your body today&mdash;every path here counts.
          </p>
          <div className={rcStyles.scenePill}>{SCENE_LABELS[scene]}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={rcStyles.secondaryButton}
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
          <button className={rcStyles.resetButton} onClick={resetGame}>
            Reset Game
          </button>
        </div>
      </div>

      <div className={rcStyles.topRow}>
        <div className={rcStyles.statsContainer}>
          <div className={rcStyles.statsTitle}>How you&apos;re feeling</div>
          {renderStatsBar('Confidence', stats.confidence, '#ef4444' /* red */, true)}
          {renderStatsBar('Mood', stats.mood, '#22c55e' /* green */)}
          {renderStatsBar('Health', stats.health, '#3b82f6' /* blue */)}
          {renderStatsBar('Energy', stats.energy, '#facc15' /* yellow */)}
        </div>
      </div>

      <div className={rcStyles.sceneImageWrap}>
        <img
          src={SCENE_IMAGES[sceneImageKey]}
          alt=""
          className={rcStyles.sceneImage}
          style={{
            transform:
              sceneImageKey === 'watch' || sceneImageKey === 'stretchingMats'
                ? 'scaleX(-1)'
                : 'none',
          }}
        />
      </div>

      {renderSceneContent()}
    </div>
  );
}
