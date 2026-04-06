import React from 'react';
import { useNavigate } from 'react-router';
import { rcStyles } from '../Static/rockClimbingStyles';

export default function DomesticHome() {
  const navigate = useNavigate();

  return (
    <div className={rcStyles.container}>
      <div className={rcStyles.header}>
        <div className={rcStyles.headerLeft}>
          <h1 className={rcStyles.mainTitle}>Domestic Activities</h1>
          <p className={rcStyles.headerSubtitle}>
            Pick an activity zone. Inside is classic chores; outside is everyday errands and home tasks.
          </p>
          <div className={rcStyles.scenePill}>Home base</div>
        </div>
        <button className={rcStyles.secondaryButton} onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>

      <div className={rcStyles.section}>
        <h2 className={rcStyles.title}>Choose where you want to play</h2>
        <div className={rcStyles.buttonGroup}>
          <button className={rcStyles.button} onClick={() => navigate('/indoor-domestic')}>
            Inside the house (chores)
          </button>
          <button className={rcStyles.button} onClick={() => navigate('/outside-domestic')}>
            Outside / around the house
          </button>
        </div>
      </div>
    </div>
  );
}

