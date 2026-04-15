import React from 'react';
import { useNavigate } from 'react-router';
import { rcStyles } from '../Static/rockClimbingStyles';
import { ActionPanel } from './ActionPanel.tsx';

export default function MindfulnessHome() {
  const navigate = useNavigate();

  return (
    <div className={rcStyles.container}>
      <div className={rcStyles.header}>
        <div className={rcStyles.headerLeft}>
          <h1 className={rcStyles.mainTitle}>Mindfulness</h1>
          <p className={rcStyles.headerSubtitle}>
            A short space for affirming phrases and gentle stat feedback—no scores to beat.
          </p>
        </div>
        <button type="button" className={rcStyles.secondaryButton} onClick={() => navigate('/')}>
          Back to hub
        </button>
      </div>

      <div className={rcStyles.section}>
        <h2 className={rcStyles.title}>Ready?</h2>
        <p className={rcStyles.paragraph}>
          Open the phrase game whenever you want a moment to check in with yourself.
        </p>
        <ActionPanel
          actions={[
            {
              id: 'start-mindfulness',
              className: rcStyles.primaryButton,
              label: 'Start mindfulness game',
              action: () => navigate('/mindfulness'),
            },
          ]}
        />
      </div>
    </div>
  );
}
