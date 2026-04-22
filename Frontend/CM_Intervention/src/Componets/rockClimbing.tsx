// RockClimbing: a small choice-based mini‑game set in a climbing gym.
// This component owns the narrative flow and stat logic; layout / visuals
// are handled via Tailwind utility sets in `rockClimbingStyles`.
import React, { useState } from 'react';
import { href, useNavigate } from 'react-router';
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
import { ActionPanel, SecondaryActionPanel } from "./ActionPanel.tsx";
import {
  statsUpdate,
  StatsPanel,
  StatDeltaViewer,
  StatDelta,
} from "./StatsPanel.tsx";
import {
  BackButton,
  Container,
  Header,
  HeaderLeft,
  HeaderRight,
  MainTitle,
  Paragraph,
  ResetButton,
  ScenePill,
  SecondaryButton,
  Section,
  Subtitle,
  Title,
  TopRow,
} from "./Layout.tsx";
import ActivityImage from "./ActivityImage.tsx";

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
  const [scene, setScene] = useState<"entrance" | "wall" | "watch" | "stretch">(
    "entrance",
  );
  // step is a small state machine inside each scene (intro → choices → result).
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0); // 0 = entrance, 1 = path intro, 2 = path follow-up choices, 3 = path follow-up result
  const [lastDelta, setLastDelta] = useState({
    confidence: 0,
    mood: 0,
    health: 0,
    energy: 0,
  });
  const [resultText, setResultText] = useState("");
  const [stretchChoice, setStretchChoice] = useState<
    "health" | "easyHolds" | null
  >(null);
  const [watchChoice, setWatchChoice] = useState<"cheer" | "ask" | null>(null);
  const [wallChoice, setWallChoice] = useState<"easy" | "hard" | null>(null);

  // Apply stat changes in one place; any missing fields default to 0.
  const applyDelta = (delta: StatDelta) => {
    setStats((prev) =>
      statsUpdate(prev, {
        confidence: delta.confidence ?? 0,
        mood: delta.mood ?? 0,
        health: delta.health ?? 0,
        energy: delta.energy ?? 0,
      }),
    );
    setLastDelta({
      confidence: delta.confidence || 0,
      mood: delta.mood || 0,
      health: delta.health || 0,
      energy: delta.energy || 0,
    });
  };

  // Hard reset back to the entrance with baseline stats.
  // const resetGame = () => {
  //   setStats(initialStats);
  //   setScene("entrance");
  //   setStep(0);
  //   setLastDelta({ confidence: 0, mood: 0, health: 0, energy: 0 });        commented out as the reset button was removed.
  //   setResultText("");
  //   setStretchChoice(null);
  //   setWatchChoice(null);
  //   setWallChoice(null);
  // };

  // Soft reset used by "Back to Entrance" buttons after a branch.
  const backToEntrance = () => {
    setScene("entrance");
    setStep(0);
    setLastDelta({ confidence: 0, mood: 0, health: 0, energy: 0 });
    setResultText("");
    setStretchChoice(null);
    setWatchChoice(null);
    setWallChoice(null);
  };

  // Handle the very first choice from the entrance and move into a branch.
  const handleEntranceChoice = (choice: "wall" | "watch" | "stretch") => {
    if (choice === "wall") {
      applyDelta({ confidence: +8, mood: +5, health: +5, energy: -10 });
      setScene("wall");
    } else if (choice === "watch") {
      applyDelta({ confidence: +4, mood: +6, health: 0, energy: -2 });
      setScene("watch");
    } else if (choice === "stretch") {
      applyDelta({ confidence: +3, mood: +5, health: +10, energy: -3 });
      setScene("stretch");
    }
    setStep(1);
    setResultText("");
  };

  // Wall follow‑ups: easier vs harder route trades energy vs confidence.
  const handleWallFollowup = (choice: "easy" | "hard") => {
    setWallChoice(choice);
    if (choice === "easy") {
      applyDelta({ confidence: +6, mood: +4, health: +3, energy: -5 });
      setResultText(
        "You pick a friendlier route, focusing on smooth movement and breathing. Each hold feels more approachable, and you notice small wins stacking up.",
      );
    } else if (choice === "hard") {
      applyDelta({ confidence: +10, mood: +3, health: +2, energy: -12 });
      setResultText(
        "You step onto the harder route, taking your time and honoring where your body is today. Every attempt is valid effort, and you celebrate the courage it took to try.",
      );
    }
    setStep(3);
  };

  // Watching follow‑ups: social choices that mostly affect mood / confidence.
  const handleWatchFollowup = (choice: "cheer" | "ask") => {
    setWatchChoice(choice);
    if (choice === "cheer") {
      applyDelta({ confidence: +5, mood: +8, health: 0, energy: -1 });
      setResultText(
        "You cheer for another climber, noticing how their effort inspires you. The room feels warmer and more connected, and you feel proud of the support you offered.",
      );
    } else if (choice === "ask") {
      applyDelta({ confidence: +7, mood: +4, health: +2, energy: -2 });
      setResultText(
        "You talk with staff about beginner routes, getting clear, kind guidance. Knowing there are options that meet you where you are makes the wall feel less intimidating.",
      );
    }
    setStep(3);
  };

  // Stretch follow‑ups: health vs easy climbing warm‑up, both supportive.
  const handleStretchFollowup = (choice: "health" | "easyHolds") => {
    setStretchChoice(choice);
    if (choice === "health") {
      applyDelta({ confidence: +4, mood: +6, health: +12, energy: -3 });
      setResultText(
        "You move gently through your joints, paying attention to what feels good. Each stretch is a small act of care, reminding you that comfort matters as much as challenge.",
      );
    } else if (choice === "easyHolds") {
      applyDelta({ confidence: +7, mood: +7, health: +8, energy: -6 });
      setResultText(
        "You warm up on easier holds, letting your body find its rhythm. The movements stay light and playful, and you notice tension slowly drifting away.",
      );
    }
    setStep(3);
  };

  const renderSceneContent = () => {
    if (scene === 'entrance') {
      return (
        <Section>
          <Title>Climbing Gym Entrance</Title>
          <Paragraph>
            You enter the climbing gym and take in the sound of chalk bags,
            friendly chatter, and shoes squeaking on the mats. Today, your goal
            is simply to notice what feels right for your body and energy,
            without judgment.
          </Paragraph>
          <ActionPanel
            actions={[
              {
                id: "wall",
                label: "Hop on the wall",
                action: () => handleEntranceChoice("wall"),
              },
              {
                id: "watch",
                label: "Sit and watch",
                action: () => handleEntranceChoice("watch"),
              },
              {
                id: "stretch",
                label: "Go stretch and warm up",
                action: () => handleEntranceChoice("stretch"),
              },
            ]}
          />
        </Section>
      );
    }

    if (scene === 'wall') {
      if (step === 1) {
        return (
          <Section>
            <Title>On the Wall</Title>
            <Paragraph>
              You clip your shoes, chalk up, and place your hands on the holds.
              You don’t need to climb your hardest; you’re allowed to explore
              what feels steady and kind to your body today.
            </Paragraph>
            <Paragraph>
              Each move is a chance to listen to your breathing and notice your
              strength without labeling it as “good” or “bad.”
            </Paragraph>
            <StatDeltaViewer delta={lastDelta} />
            <SecondaryActionPanel
              actions={[
                {
                  id: "wall-continue",
                  isPrimary: true,
                  label: "Continue",
                  action: () => setStep(2),
                },
              ]}
            />
          </Section>
        );
      }

      if (step === 2) {
        return (
          <Section>
            <Title>Choosing a Route</Title>
            <Paragraph>
              Looking at the wall, you notice both gentler lines and more
              demanding climbs. You’re free to choose what fits your capacity
              right now, without needing to prove anything.
            </Paragraph>
            <ActionPanel
              actions={[
                {
                  id: "wall-easy",
                  label: "Try an easier route",
                  action: () => handleWallFollowup("easy"),
                },
                {
                  id: "wall-hard",
                  label: "Try a harder route",
                  action: () => handleWallFollowup("hard"),
                },
              ]}
            />
          </Section>
        );
      }

      if (step === 3) {
        return (
          <Section>
            <Title>On the Wall – Afterward</Title>
            <Paragraph>{resultText}</Paragraph>
            <StatDeltaViewer delta={lastDelta} />
            <SecondaryActionPanel
              actions={[
                {
                  id: "wall-back",
                  isPrimary: false,
                  label: "Back to Entrance",
                  action: backToEntrance,
                },
              ]}
            />
          </Section>
        );
      }
    }

    if (scene === 'watch') {
      if (step === 1) {
        return (
          <Section>
            <Title>Watching from the Mats</Title>
            <Paragraph>
              You settle onto the mats and watch climbers move in all sorts of
              bodies and styles. Some move quickly, some slowly, and none of
              them need to look a certain way to belong here.
            </Paragraph>
            <Paragraph>
              Observing from a distance gives you space to notice what feels
              interesting or inviting without pressure to join in right away.
            </Paragraph>
            <StatDeltaViewer delta={lastDelta} />
            <SecondaryActionPanel
              actions={[
                {
                  id: "watch-continue",
                  isPrimary: true,
                  label: "Continue",
                  action: () => setStep(2),
                },
              ]}
            />
          </Section>
        );
      }

      if (step === 2) {
        return (
          <Section>
            <Title>Connecting from the Sidelines</Title>
            <Paragraph>
              As you keep watching, you notice chances to connect—either by
              offering encouragement or asking for guidance. Both are valid,
              grounded ways to participate.
            </Paragraph>
            <ActionPanel
              actions={[
                {
                  id: "watch-cheer",
                  label: "Cheer someone on",
                  action: () => handleWatchFollowup("cheer"),
                },
                {
                  id: "watch-ask",
                  label: "Ask staff about beginner routes",
                  action: () => handleWatchFollowup("ask"),
                },
              ]}
            />
          </Section>
        );
      }

      if (step === 3) {
        return (
          <Section>
            <Title>Watching – Afterward</Title>
            <Paragraph>{resultText}</Paragraph>
            <StatDeltaViewer delta={lastDelta} />
            <SecondaryActionPanel
              actions={[
                {
                  id: "watch-back",
                  isPrimary: false,
                  label: "Back to Entrance",
                  action: backToEntrance,
                },
              ]}
            />
          </Section>
        );
      }
    }

    if (scene === 'stretch') {
      if (step === 1) {
        return (
          <Section>
            <Title>Stretching and Warming Up</Title>
            <Paragraph>
              You find a quiet spot and start with simple movements—rolling your
              shoulders, circling your wrists, and gently waking up your legs.
            </Paragraph>
            <Paragraph>
              Instead of chasing “perfect form,” you focus on what feels
              supportive, letting your body set the pace and depth of each
              stretch.
            </Paragraph>
            <StatDeltaViewer delta={lastDelta} />
            <ActionPanel
              actions={[
                {
                  id: "stretch-continue",
                  isPrimary: true,
                  label: "Continue",
                  action: () => setStep(2),
                },
              ]}
            />
          </Section>
        );
      }

      if (step === 2) {
        return (
          <Section>
            <Title>Choosing How to Warm Up</Title>
            <Paragraph>
              You consider whether your body would appreciate more gentle health
              or whether it might feel good to move onto very easy holds. Either
              option is a valid way to care for yourself.
            </Paragraph>
            <ActionPanel
              actions={[
                {
                  id: "stretch-health",
                  label: "Do gentle health work",
                  action: () => handleStretchFollowup("health"),
                },
                {
                  id: "stretch-holds",
                  label: "Warm up on the easy holds",
                  action: () => handleStretchFollowup("easyHolds"),
                },
              ]}
            />
          </Section>
        );
      }

      if (step === 3) {
        return (
          <Section>
            <Title>Stretching – Afterward</Title>
            <Paragraph>{resultText}</Paragraph>
            <StatDeltaViewer delta={lastDelta} />
            <SecondaryActionPanel
              actions={[
                {
                  id: "stretch-back",
                  isPrimary: false,
                  label: "Back to Entrance",
                  action: backToEntrance,
                },
              ]}
            />
          </Section>
        );
      }
    }

    return null;
  };

  // Pick image to show for current scene/step/choice (entrance, wall, watch, stretch paths).
  const sceneImageKey =
    scene === "entrance"
      ? "entrance"
      : scene === "wall"
        ? step === 1
          ? "whichRoute"
          : step === 3 && wallChoice === "hard"
            ? "hardRoute"
            : "climbingWall"
        : scene === "watch"
          ? step === 3 && watchChoice === "cheer"
            ? "cheerOn"
            : step === 3 && watchChoice === "ask"
              ? "askRoutes"
              : "watch"
          : scene === "stretch"
            ? step === 3 && stretchChoice === "health"
              ? "gentleMobility"
              : step === 3 && stretchChoice === "easyHolds"
                ? "warmupHolds"
                : "stretchingMats"
            : "entrance";

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <MainTitle>Rock Climbing Gym</MainTitle>
          <Subtitle>
            Choose what feels right for your body today&mdash;every path here
            counts.
          </Subtitle>
          <ScenePill>{SCENE_LABELS[scene]}</ScenePill>
        </HeaderLeft>
        <HeaderRight>
          <BackButton onClick={() => navigate(href("/leisure"))} />
          {/* <ResetButton onClick={resetGame}>Reset Game</ResetButton> */}
        </HeaderRight>
      </Header>

      <TopRow>
        <StatsPanel stats={stats} />
      </TopRow>

      <ActivityImage>
        <img
          src={SCENE_IMAGES[sceneImageKey]}
          style={{
            transform:
              sceneImageKey === "watch" || sceneImageKey === "stretchingMats"
                ? "scaleX(-1)"
                : "none",
          }}
        />
      </ActivityImage>

      {renderSceneContent()}
    </Container>
  );
}
