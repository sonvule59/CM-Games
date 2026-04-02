import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { rcStyles } from '../Static/rockClimbingStyles';

import rockBg from '../images/enteringGym.png';
import outdoorsBg from '../images/pullingUpLake.png';
import walkBg from '../images/walkingLake.png';
import swinBg from '../images/swimLap.png'

export default function LeisureHome() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null); // 'rock' | 'outdoors' | 'walk' | null

  const bg = useMemo(() => {
    if (hovered === 'rock') return rockBg;
    if (hovered === 'outdoors') return outdoorsBg;
    if (hovered === 'walk') return walkBg;
    if (hovered === 'swim') return swinBg
    return null;
  }, [hovered]);

  return (
    <div
      className={`${rcStyles.container} relative overflow-hidden max-w-6xl min-h-[78vh] py-10`}
    >
      {/* Faded hover background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-opacity duration-200"
        style={{
          backgroundImage: bg ? `url(${bg})` : 'none',
          // Make the preview feel "bigger" by scaling the background image up.
          backgroundSize: '170%',
          // backgroundPosition: 'center 35%',
          animation: 'background-scroll 10s infinite ease-in-out alternate',
          opacity: bg ? 0.14 : 0,
          filter: 'blur(0.25px)',
        }}
      />

      {/* Foreground content */}
      <div className="relative">
        <div className={rcStyles.header}>
          <div className={rcStyles.headerLeft}>
            <h1 className={rcStyles.mainTitle}>Leisure Game Center</h1>
            <p className={rcStyles.headerSubtitle}>
              Pick a mini-game to play. Hover a button to preview the vibe.
            </p>
          </div>
        </div>

        <div className={rcStyles.section}>
          <h2 className={rcStyles.title}>Choose a game</h2>
          <div className={rcStyles.buttonGroup}>
            <button
              className={rcStyles.button}
              onMouseEnter={() => setHovered('rock')}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered('rock')}
              onBlur={() => setHovered(null)}
              onClick={() => navigate('/rock')}
            >
              Rock Climbing
            </button>

            <button
              className={rcStyles.button}
              onMouseEnter={() => setHovered('outdoors')}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered('outdoors')}
              onBlur={() => setHovered(null)}
              onClick={() => navigate('/outdoors')}
            >
              Outdoors Activities (Lake)
            </button>

            <button
              className={rcStyles.button}
              onMouseEnter={() => setHovered('walk')}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered('walk')}
              onBlur={() => setHovered(null)}
              onClick={() => navigate('/walk')}
            >
              Walking Activities
            </button>
            <button
            className={rcStyles.button}
              onMouseEnter={() => setHovered('swim')}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered('swim')}
              onBlur={() => setHovered(null)}
              onClick={() => navigate('/swim')}
            >
              Swimming Activities
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

