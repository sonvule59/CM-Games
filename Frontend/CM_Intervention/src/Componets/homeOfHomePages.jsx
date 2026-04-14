import React from 'react';
import { useNavigate } from 'react-router';
import { rcStyles } from '../Static/rockClimbingStyles';

export default function HomeOfHomePages() {
  const navigate = useNavigate();

  return (
    <div className={rcStyles.container}>
      <div className={rcStyles.header}>
        <div className={rcStyles.headerLeft}>
          <h1 className={rcStyles.mainTitle}>Activity hub</h1>
          <p className={rcStyles.headerSubtitle}>
            Choose a world: leisure, home, office wellness, or a short mindfulness phrase game.
          </p>
        </div>
      </div>

      <div className={rcStyles.section}>
        <h2 className={rcStyles.title}>Where do you want to go?</h2>
        <div className={rcStyles.buttonGroup}>
          <button
            type="button"
            className={rcStyles.button}
            onClick={() => navigate('/leisure')}
          >
            Leisure
          </button>
          <button
            type="button"
            className={rcStyles.button}
            onClick={() => navigate('/domestic-home')}
          >
            Domestic (home)
          </button>
          <button
            type="button"
            className={rcStyles.button}
            onClick={() => navigate('/office')}
          >
            Office game
          </button>
          <button
            type="button"
            className={rcStyles.button}
            onClick={() => navigate('/mindfulness-home')}
          >
            Mindfulness
          </button>
        </div>
      </div>
    </div>
  );
}
