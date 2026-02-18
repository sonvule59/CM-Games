import React, { useState } from 'react';

export default function RockClimbing() {
  const initialStats = {
    energy: 50,
    confidence: 50,
    mood: 50,
    mobility: 50,
  };

  const [stats, setStats] = useState(initialStats);
  const [scene, setScene] = useState('entrance'); // 'entrance' | 'wall' | 'watch' | 'stretch'
  const [step, setStep] = useState(0); // 0 = entrance, 1 = path intro, 2 = path follow-up choices, 3 = path follow-up result
  const [lastDelta, setLastDelta] = useState({
    energy: 0,
    confidence: 0,
    mood: 0,
    mobility: 0,
  });
  const [resultText, setResultText] = useState('');

  const clamp = (value) => Math.max(0, Math.min(100, value));

  const applyDelta = (delta) => {
    setStats((prev) => ({
      energy: clamp(prev.energy + (delta.energy || 0)),
      confidence: clamp(prev.confidence + (delta.confidence || 0)),
      mood: clamp(prev.mood + (delta.mood || 0)),
      mobility: clamp(prev.mobility + (delta.mobility || 0)),
    }));
    setLastDelta({
      energy: delta.energy || 0,
      confidence: delta.confidence || 0,
      mood: delta.mood || 0,
      mobility: delta.mobility || 0,
    });
  };

  const resetGame = () => {
    setStats(initialStats);
    setScene('entrance');
    setStep(0);
    setLastDelta({ energy: 0, confidence: 0, mood: 0, mobility: 0 });
    setResultText('');
  };

  const backToEntrance = () => {
    setScene('entrance');
    setStep(0);
    setLastDelta({ energy: 0, confidence: 0, mood: 0, mobility: 0 });
    setResultText('');
  };

  const handleEntranceChoice = (choice) => {
    if (choice === 'wall') {
      applyDelta({ energy: -10, confidence: +8, mood: +5, mobility: +5 });
      setScene('wall');
    } else if (choice === 'watch') {
      applyDelta({ energy: -2, confidence: +4, mood: +6, mobility: 0 });
      setScene('watch');
    } else if (choice === 'stretch') {
      applyDelta({ energy: -3, confidence: +3, mood: +5, mobility: +10 });
      setScene('stretch');
    }
    setStep(1);
    setResultText('');
  };

  const handleWallFollowup = (choice) => {
    if (choice === 'easy') {
      applyDelta({ energy: -5, confidence: +6, mood: +4, mobility: +3 });
      setResultText(
        'You pick a friendlier route, focusing on smooth movement and breathing. Each hold feels more approachable, and you notice small wins stacking up.'
      );
    } else if (choice === 'hard') {
      applyDelta({ energy: -12, confidence: +10, mood: +3, mobility: +2 });
      setResultText(
        'You step onto the harder route, taking your time and honoring where your body is today. Every attempt is valid effort, and you celebrate the courage it took to try.'
      );
    }
    setStep(3);
  };

  const handleWatchFollowup = (choice) => {
    if (choice === 'cheer') {
      applyDelta({ energy: -1, confidence: +5, mood: +8, mobility: 0 });
      setResultText(
        'You cheer for another climber, noticing how their effort inspires you. The room feels warmer and more connected, and you feel proud of the support you offered.'
      );
    } else if (choice === 'ask') {
      applyDelta({ energy: -2, confidence: +7, mood: +4, mobility: +2 });
      setResultText(
        'You talk with staff about beginner routes, getting clear, kind guidance. Knowing there are options that meet you where you are makes the wall feel less intimidating.'
      );
    }
    setStep(3);
  };

  const handleStretchFollowup = (choice) => {
    if (choice === 'mobility') {
      applyDelta({ energy: -3, confidence: +4, mood: +6, mobility: +12 });
      setResultText(
        'You move gently through your joints, paying attention to what feels good. Each stretch is a small act of care, reminding you that comfort matters as much as challenge.'
      );
    } else if (choice === 'easyHolds') {
      applyDelta({ energy: -6, confidence: +7, mood: +7, mobility: +8 });
      setResultText(
        'You warm up on easier holds, letting your body find its rhythm. The movements stay light and playful, and you notice tension slowly drifting away.'
      );
    }
    setStep(3);
  };

  const renderDeltaList = () => {
    const items = [];
    const labels = {
      energy: 'Energy',
      confidence: 'Confidence',
      mood: 'Mood',
      mobility: 'Mobility',
    };

    Object.keys(lastDelta).forEach((key) => {
      const value = lastDelta[key];
      if (!value) return;
      const sign = value > 0 ? '+' : '';
      items.push(
        <li key={key} style={{ marginBottom: 4 }}>
          {sign}
          {value} {labels[key]}
        </li>
      );
    });

    if (items.length === 0) {
      return <li>No recent changes.</li>;
    }

    return items;
  };

  const renderStatsBar = (label, value, color) => {
    return (
      <div style={styles.statRow}>
        <div style={styles.statLabel}>{label}</div>
        <div style={styles.barOuter}>
          <div style={{ ...styles.barInner, width: `${value}%`, backgroundColor: color }} />
        </div>
        <div style={styles.statValue}>{value}</div>
      </div>
    );
  };

  const renderSceneContent = () => {
    if (scene === 'entrance') {
      return (
        <div style={{ marginTop: 24 }}>
          <h2 style={styles.title}>Climbing Gym Entrance</h2>
          <p style={styles.paragraph}>
            You enter the climbing gym and take in the sound of chalk bags, friendly chatter, and shoes
            squeaking on the mats. Today, your goal is simply to notice what feels right for your body and
            energy, without judgment.
          </p>
          <div style={styles.buttonGroup}>
            <button
              style={styles.button}
              onClick={() => handleEntranceChoice('wall')}
            >
              Hop on the wall
            </button>
            <button
              style={styles.button}
              onClick={() => handleEntranceChoice('watch')}
            >
              Sit and watch
            </button>
            <button
              style={styles.button}
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
          <div style={{ marginTop: 24 }}>
            <h2 style={styles.title}>On the Wall</h2>
            <p style={styles.paragraph}>
              You clip your shoes, chalk up, and place your hands on the holds. You don’t need to climb your
              hardest; you’re allowed to explore what feels steady and kind to your body today.
            </p>
            <p style={styles.paragraph}>
              Each move is a chance to listen to your breathing and notice your strength without labeling it
              as “good” or “bad.”
            </p>
            <div style={styles.deltaContainer}>
              <h3 style={styles.subtitle}>Recent changes</h3>
              <ul style={styles.deltaList}>{renderDeltaList()}</ul>
            </div>
            <button style={styles.primaryButton} onClick={() => setStep(2)}>
              Continue
            </button>
          </div>
        );
      }

      if (step === 2) {
        return (
          <div style={{ marginTop: 24 }}>
            <h2 style={styles.title}>Choosing a Route</h2>
            <p style={styles.paragraph}>
              Looking at the wall, you notice both gentler lines and more demanding climbs. You’re free to
              choose what fits your capacity right now, without needing to prove anything.
            </p>
            <div style={styles.buttonGroup}>
              <button
                style={styles.button}
                onClick={() => handleWallFollowup('easy')}
              >
                Try an easier route
              </button>
              <button
                style={styles.button}
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
          <div style={{ marginTop: 24 }}>
            <h2 style={styles.title}>On the Wall – Afterward</h2>
            <p style={styles.paragraph}>{resultText}</p>
            <div style={styles.deltaContainer}>
              <h3 style={styles.subtitle}>Recent changes</h3>
              <ul style={styles.deltaList}>{renderDeltaList()}</ul>
            </div>
            <button style={styles.secondaryButton} onClick={backToEntrance}>
              Back to Entrance
            </button>
          </div>
        );
      }
    }

    if (scene === 'watch') {
      if (step === 1) {
        return (
          <div style={{ marginTop: 24 }}>
            <h2 style={styles.title}>Watching from the Mats</h2>
            <p style={styles.paragraph}>
              You settle onto the mats and watch climbers move in all sorts of bodies and styles. Some move
              quickly, some slowly, and none of them need to look a certain way to belong here.
            </p>
            <p style={styles.paragraph}>
              Observing from a distance gives you space to notice what feels interesting or inviting without
              pressure to join in right away.
            </p>
            <div style={styles.deltaContainer}>
              <h3 style={styles.subtitle}>Recent changes</h3>
              <ul style={styles.deltaList}>{renderDeltaList()}</ul>
            </div>
            <button style={styles.primaryButton} onClick={() => setStep(2)}>
              Continue
            </button>
          </div>
        );
      }

      if (step === 2) {
        return (
          <div style={{ marginTop: 24 }}>
            <h2 style={styles.title}>Connecting from the Sidelines</h2>
            <p style={styles.paragraph}>
              As you keep watching, you notice chances to connect—either by offering encouragement or asking
              for guidance. Both are valid, grounded ways to participate.
            </p>
            <div style={styles.buttonGroup}>
              <button
                style={styles.button}
                onClick={() => handleWatchFollowup('cheer')}
              >
                Cheer someone on
              </button>
              <button
                style={styles.button}
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
          <div style={{ marginTop: 24 }}>
            <h2 style={styles.title}>Watching – Afterward</h2>
            <p style={styles.paragraph}>{resultText}</p>
            <div style={styles.deltaContainer}>
              <h3 style={styles.subtitle}>Recent changes</h3>
              <ul style={styles.deltaList}>{renderDeltaList()}</ul>
            </div>
            <button style={styles.secondaryButton} onClick={backToEntrance}>
              Back to Entrance
            </button>
          </div>
        );
      }
    }

    if (scene === 'stretch') {
      if (step === 1) {
        return (
          <div style={{ marginTop: 24 }}>
            <h2 style={styles.title}>Stretching and Warming Up</h2>
            <p style={styles.paragraph}>
              You find a quiet spot and start with simple movements—rolling your shoulders, circling your
              wrists, and gently waking up your legs.
            </p>
            <p style={styles.paragraph}>
              Instead of chasing “perfect form,” you focus on what feels supportive, letting your body set
              the pace and depth of each stretch.
            </p>
            <div style={styles.deltaContainer}>
              <h3 style={styles.subtitle}>Recent changes</h3>
              <ul style={styles.deltaList}>{renderDeltaList()}</ul>
            </div>
            <button style={styles.primaryButton} onClick={() => setStep(2)}>
              Continue
            </button>
          </div>
        );
      }

      if (step === 2) {
        return (
          <div style={{ marginTop: 24 }}>
            <h2 style={styles.title}>Choosing How to Warm Up</h2>
            <p style={styles.paragraph}>
              You consider whether your body would appreciate more gentle mobility or whether it might feel
              good to move onto very easy holds. Either option is a valid way to care for yourself.
            </p>
            <div style={styles.buttonGroup}>
              <button
                style={styles.button}
                onClick={() => handleStretchFollowup('mobility')}
              >
                Do gentle mobility work
              </button>
              <button
                style={styles.button}
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
          <div style={{ marginTop: 24 }}>
            <h2 style={styles.title}>Stretching – Afterward</h2>
            <p style={styles.paragraph}>{resultText}</p>
            <div style={styles.deltaContainer}>
              <h3 style={styles.subtitle}>Recent changes</h3>
              <ul style={styles.deltaList}>{renderDeltaList()}</ul>
            </div>
            <button style={styles.secondaryButton} onClick={backToEntrance}>
              Back to Entrance
            </button>
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>Rock Climbing Gym</h1>
        <button style={styles.resetButton} onClick={resetGame}>
          Reset Game
        </button>
      </div>

      <div style={styles.statsContainer}>
        {renderStatsBar('Energy', stats.energy, '#f97316')}
        {renderStatsBar('Confidence', stats.confidence, '#22c55e')}
        {renderStatsBar('Mood', stats.mood, '#3b82f6')}
        {renderStatsBar('Mobility', stats.mobility, '#a855f7')}
      </div>

      {renderSceneContent()}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 720,
    margin: '24px auto',
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)',
    fontFamily: '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    color: '#0f172a',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
  },
  resetButton: {
    padding: '6px 12px',
    borderRadius: 999,
    border: '1px solid #cbd5f5',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: 12,
    color: '#1f2937',
  },
  statsContainer: {
    marginTop: 8,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  statRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    width: 90,
    fontSize: 13,
    fontWeight: 600,
  },
  barOuter: {
    flex: 1,
    height: 14,
    borderRadius: 999,
    backgroundColor: '#d1d5db',
    overflow: 'hidden',
    marginRight: 8,
  },
  barInner: {
    height: '100%',
    borderRadius: 999,
    transition: 'width 0.25s ease',
  },
  statValue: {
    width: 32,
    textAlign: 'right',
    fontSize: 12,
    fontVariantNumeric: 'tabular-nums',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: 20,
    fontWeight: 700,
  },
  subtitle: {
    margin: '0 0 4px 0',
    fontSize: 14,
    fontWeight: 600,
  },
  paragraph: {
    margin: '4px 0 8px 0',
    fontSize: 14,
    lineHeight: 1.5,
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginTop: 12,
  },
  button: {
    padding: '10px 14px',
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#3b82f6',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 14,
    textAlign: 'left',
  },
  primaryButton: {
    marginTop: 12,
    padding: '10px 16px',
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#10b981',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 14,
  },
  secondaryButton: {
    marginTop: 12,
    padding: '10px 16px',
    borderRadius: 8,
    border: '1px solid #9ca3af',
    backgroundColor: '#fff',
    color: '#374151',
    cursor: 'pointer',
    fontSize: 14,
  },
  deltaContainer: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e0f2fe',
  },
  deltaList: {
    margin: 0,
    paddingLeft: 18,
    fontSize: 13,
  },
};

