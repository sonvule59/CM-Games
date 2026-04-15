import React, { useMemo, useState } from 'react';
import { useNavigate } from "react-router";

import rockBg from '../images/enteringGym.png';
import outdoorsBg from '../images/pullingUpLake.png';
import walkBg from '../images/walkingLake.png';
import {
  BackButton,
  Container,
  Header,
  HeaderLeft,
  HeaderSubtitle,
  MainTitle,
  Section,
} from "./Layout";
import { ActionPanel } from "./ActionPanel";

export default function LeisureHome() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null); // 'rock' | 'outdoors' | 'walk' | null

  const bg = useMemo(() => {
    if (hovered === 'rock') return rockBg;
    if (hovered === 'outdoors') return outdoorsBg;
    if (hovered === 'walk') return walkBg;
    return null;
  }, [hovered]);

  return (
    <Container
      className={`relative overflow-hidden max-w-6xl min-h-[78vh] py-10`}
    >
      {/* Faded hover background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-opacity duration-200"
        style={{
          backgroundImage: bg ? `url(${bg})` : "none",
          // Make the preview feel "bigger" by scaling the background image up.
          backgroundSize: "170%",
          // backgroundPosition: 'center 35%',
          animation: "background-scroll 10s infinite ease-in-out alternate",
          opacity: bg ? 0.14 : 0,
          filter: "blur(0.25px)",
        }}
      />

      {/* Foreground content */}
      <div className="relative">
        <Header>
          <HeaderLeft>
            <MainTitle>Leisure Game Center</MainTitle>
            <HeaderSubtitle>
              Pick a mini-game to play. Hover a button to preview the vibe.
            </HeaderSubtitle>
          </HeaderLeft>
          <BackButton onClick={() => navigate("/")}>Back to hub</BackButton>
        </Header>

        <Section>
          <ActionPanel
            title={<>Choose a game</>}
            actions={[
              {
                key: "rock",
                onMouseEnter: () => setHovered("rock"),
                onMouseLeave: () => setHovered(null),
                onFocus: () => setHovered("rock"),
                onBlur: () => setHovered(null),
                onClick: () => navigate("/rock"),
                label: <>Rock Climbing</>,
              },
              {
                key: "outdoors",
                onMouseEnter: () => setHovered("outdoors"),
                onMouseLeave: () => setHovered(null),
                onFocus: () => setHovered("outdoors"),
                onBlur: () => setHovered(null),
                onClick: () => navigate("/outdoors"),
                label: <>Outdoors Activities (Lake)</>,
              },
              {
                key: "walk",
                onMouseEnter: () => setHovered("walk"),
                onMouseLeave: () => setHovered(null),
                onFocus: () => setHovered("walk"),
                onBlur: () => setHovered(null),
                onClick: () => navigate("/walk"),
                label: <>Walking Activities</>,
              },
            ]}
          />
        </Section>
      </div>
    </Container>
  );
}

