import { useState } from "react";
import { href, useNavigate } from "react-router-dom";
import {
  Container,
  Header,
  HeaderLeft,
  HeaderSubtitle,
  MainTitle,
  Paragraph,
  PrimaryButton,
  ResetButton,
  ScenePill,
  Section,
  Title,
  TopRow,
} from "./Layout.js";
import { ActionPanel, SecondaryActionPanel } from "./ActionPanel.js";
import { StatDeltaViewer, StatsPanel } from "./StatsPanel.js";
import ActivityImage from "./ActivityImage.js";

// ── Images ────────────────────────────────────────────────────────────────────
const busStopImg     = "/assets/Images/Woman_heading_to_bus_stop.png";
const confidentImg   = "/assets/Images/Heading_to_work_with_confidence.png";
const stairsImg      = "/assets/Images/Descending_the_subway_stairs_with_care.png";
const cyclistImg     = "/assets/Images/Cyclist_on_a_sunny_bike_lane.png";
const subwayWaitImg  = "/assets/Images/Woman_walking_in_subway_station.png";

const SCENE_IMAGES = {
  start:        confidentImg,
  // walk path
  walk:         confidentImg,
  // bike path
  bike:         cyclistImg,
  // transit path
  transit:      busStopImg,
  stairs:       stairsImg,
  subwaywait:   subwayWaitImg,
  arrived:      confidentImg,
};

// ── Constants ─────────────────────────────────────────────────────────────────
const INITIAL_STATS = { confidence: 50, mood: 50, health: 50, energy: 100 };
const STAT_KEYS = ["confidence", "mood", "health", "energy"];

const SCENE_LABELS = {
  start:       "Leaving the house",
  walk:        "Walking to work",
  bike:        "Cycling in",
  transit:     "Heading to the bus stop",
  stairs:      "At the subway",
  subwaywait:  "Waiting for the train",
  arrived:     "You've arrived!",
};

export default function TransportGame() {
  const navigate = useNavigate();

  const [stats, setStats]           = useState(INITIAL_STATS);
  const [scene, setScene]           = useState("start");
  const [step, setStep]             = useState(0);
  const [lastDelta, setLastDelta] = useState({
    energy: 0,
    mood: 0,
    confidence: 0,
    health: 0,
  });
  const [resultText, setResultText] = useState("");
  const [transitChoice, setTransitChoice] = useState(null); // 'stairs' | 'escalator'
  const [waitChoice, setWaitChoice]       = useState(null); // 'walk' | 'stand'
  const [commuteMode, setCommuteMode]     = useState(null); // 'walk' | 'bike' | 'transit'

  const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));

  const applyDelta = (delta) => {
    setStats((prev) => {
      const next = {};
      STAT_KEYS.forEach((k) => (next[k] = clamp(prev[k] + (delta[k] || 0))));
      return next;
    });
    setLastDelta({
      energy: delta.energy || 0,
      mood: delta.mood || 0,
      confidence: delta.confidence || 0,
      health: delta.health || 0,
    });
  };

  const resetGame = () => {
    setStats(INITIAL_STATS);
    setScene("start");
    setStep(0);
    setLastDelta({ energy: 0, mood: 0, confidence: 0, health: 0 });
    setResultText("");
    setTransitChoice(null);
    setWaitChoice(null);
    setCommuteMode(null);
  };

  // ── Mode selection ──────────────────────────────────────────────────────────
  const handleModeChoice = (mode) => {
    setCommuteMode(mode);
    if (mode === "walk") {
      applyDelta({ energy: -8, mood: +12, confidence: +10, health: +15 });
      setScene("walk");
      setStep(1);
    } else if (mode === "bike") {
      applyDelta({ energy: -10, mood: +15, confidence: +12, health: +18 });
      setScene("bike");
      setStep(1);
    } else if (mode === "transit") {
      applyDelta({ energy: -3, mood: +6, confidence: +5, health: +5 });
      setScene("transit");
      setStep(1);
    }
  };

  // ── Transit: stairs vs escalator ───────────────────────────────────────────
  const handleStairsChoice = (choice) => {
    setTransitChoice(choice);
    if (choice === "stairs") {
      applyDelta({ energy: -5, mood: +8, confidence: +8, health: +12 });
      setScene("stairs");
      setStep(3); // → stairs result → then wait choice
      setResultText("You take the stairs at your own pace, one step at a time. Your legs wake up and your heart rate lifts just enough to feel good.");
    } else {
      applyDelta({ energy: -1, mood: +4, confidence: +3, health: +2 });
      setScene("transit");
      setStep(3);
      setResultText("You take the escalator, standing to the right. No rush — you're saving energy for the day ahead. That's a valid choice too.");
    }
  };

  // ── Transit: walk the platform vs stand ────────────────────────────────────
  const handleWaitChoice = (choice) => {
    setWaitChoice(choice);
    if (choice === "walk") {
      applyDelta({ energy: -3, mood: +10, confidence: +6, health: +8 });
      setScene("subwaywait");
      setStep(5);
      setResultText("You pace the platform gently, earphones in, watching the tunnel. Movement while you wait — every bit counts. 🚇");
    } else {
      applyDelta({ energy: +2, mood: +6, confidence: +4, health: +2 });
      setScene("subwaywait");
      setStep(5);
      setResultText("You find a bench and sit, breathing slowly. Rest is productive too. You arrive calm and ready. 🧘");
    }
  };

  // ── Scene renderer ──────────────────────────────────────────────────────────
  const renderScene = () => {

    // ── Step 0: Choose your commute ──
    if (step === 0) {
      return (
        <Section>
          <Title>How are you getting in today?</Title>
          <Paragraph>
            Every commute is a chance to move your body. Pick what works for you
            — there's no wrong answer.
          </Paragraph>
          <ActionPanel
            actions={[
              {
                id: "walk",
                icon: "🚶",
                name: "Walk",
                desc: "Fresh air, your pace",
              },
              {
                id: "bike",
                icon: "🚴",
                name: "Bike",
                desc: "Two wheels, good vibes",
              },
              {
                id: "transit",
                icon: "🚇",
                name: "Transit",
                desc: "Bus or subway",
              },
            ].map((m) => ({
              id: m.id,
              onClick: () => handleModeChoice(m.id),
              icon: m.icon,
              name: m.name,
              desc: m.desc,
            }))}
          />
        </Section>
      );
    }

    // ── Walk: step 1 (intro + result) ──
    if (scene === "walk" && step === 1) {
      return (
        <Section>
          <Title>Walking to Work 🚶</Title>
          <Paragraph>
            You step outside and the morning air hits your face. No screen, no
            seat — just you and the pavement. Your body is already thanking you.
          </Paragraph>
          <Paragraph>
            You take your time, noticing things you'd miss from a window. A good
            start to the day.
          </Paragraph>
          <StatDeltaViewer delta={lastDelta} />
          <PrimaryButton onClick={() => setStep(99)}>
            You've arrived! 🏢
          </PrimaryButton>
        </Section>
      );
    }

    // ── Bike: step 1 (intro + result) ──
    if (scene === "bike" && step === 1) {
      return (
        <Section>
          <Title>Cycling In 🚴</Title>
          <Paragraph>
            You clip in and push off. The bike lane opens up and you find your
            rhythm — legs turning, wind at your back, brain fully awake before
            you've even had coffee.
          </Paragraph>
          <Paragraph>
            This is the good stuff. Body moving, mind clear, arriving with
            energy to spare.
          </Paragraph>
          <StatDeltaViewer delta={lastDelta} />
          <PrimaryButton onClick={() => setStep(99)}>
            You've arrived! 🏢
          </PrimaryButton>
        </Section>
      );
    }

    // ── Transit: step 1 — walking to bus stop ──
    if (scene === "transit" && step === 1) {
      return (
        <Section>
          <Title>Heading to the Bus Stop 🚌</Title>
          <Paragraph>
            You grab your bag and head out. The walk to the stop is short but it
            counts — legs moving, fresh air, easing into the day.
          </Paragraph>
          <StatDeltaViewer delta={lastDelta} />
          <PrimaryButton onClick={() => setStep(2)}>
            You're at the subway 🚇
          </PrimaryButton>
        </Section>
      );
    }

    // ── Transit: step 2 — stairs or escalator ──
    if (scene === "transit" && step === 2) {
      return (
        <Section>
          <Title>Stairs or escalator? 🚇</Title>
          <Paragraph>
            You're at the entrance. Both get you down — one just works a little
            harder for you. What feels right today?
          </Paragraph>
          <ActionPanel
            actions={[
              {
                id: "stairs",
                onClick() {
                  handleStairsChoice("stairs");
                },
                label: <>Take the stairs</>,
              },
              {
                id: "escalator",
                onClick() {
                  handleStairsChoice("escalator");
                },
                label: <>Take the escalator</>,
              },
            ]}
          />
        </Section>
      );
    }

    // ── Transit: step 3 — stairs/escalator result → ask about waiting ──
    if ((scene === "stairs" || scene === "transit") && step === 3) {
      return (
        <Section>
          <Title>
            {transitChoice === "stairs" ? "Nice work! 💪" : "On your way down"}
          </Title>
          <Paragraph>{resultText}</Paragraph>
          <StatDeltaViewer delta={lastDelta} />
          <PrimaryButton onClick={() => setStep(4)}>
            Now wait for the train 🚇
          </PrimaryButton>
        </Section>
      );
    }

    // ── Transit: step 4 — walk the platform or stand? ──
    if (step === 4) {
      return (
        <Section>
          <Title>While you wait… 🚇</Title>
          <Paragraph>
            The train's a few minutes away. The platform stretches out in both
            directions. What do you feel like doing?
          </Paragraph>
          <ActionPanel
            actions={[
              {
                id: "walk",
                onClick() {
                  handleWaitChoice("walk");
                },
                label: <>Walk up and down the platform</>,
              },
              {
                id: "stand",
                onClick() {
                  handleWaitChoice("stand");
                },
                label: <>Find a spot and rest</>,
              },
            ]}
          />
        </Section>
      );
    }

    // ── Transit: step 5 — platform result → arrived ──
    if (scene === "subwaywait" && step === 5) {
      return (
        <Section>
          <Title>On the train! 🚇</Title>
          <Paragraph>{resultText}</Paragraph>
          <StatDeltaViewer delta={lastDelta} />
          <PrimaryButton onClick={() => setStep(99)}>
            You've arrived! 🏢
          </PrimaryButton>
        </Section>
      );
    }

    // ── Step 99: Arrived! ──
    if (step === 99) {
      const modeEmoji = { walk: "🚶", bike: "🚴", transit: "🚇" };
      return (
        <Section>
          <Title>You made it! {modeEmoji[commuteMode]} 🏢</Title>
          <Paragraph>
            You're here, you moved your body to get here, and that already puts
            you ahead. Time to take on the day.
          </Paragraph>
          <StatDeltaViewer delta={lastDelta} />
          <SecondaryActionPanel
            actions={[
              {
                key: "navigateToOffice",
                isPrimary: true,
                onClick: () => navigate(href("/office/game")),
                label: <>Head to the office 💼</>,
              },
              {
                key: "resetGame",
                isPrimary: false,
                onClick: resetGame,
                label: <>Try a different commute</>,
              },
            ]}
          />
        </Section>
      );
    }

    return null;
  };

  // ── Image key ──────────────────────────────────────────────────────────────
  const sceneImageKey =
    step === 99          ? "arrived"
    : scene === "stairs" ? "stairs"
    : scene === "subwaywait" ? "subwaywait"
    : scene;

  return (
    <Container>
      {/* Header */}
      <Header>
        <HeaderLeft>
          <MainTitle>The Commute</MainTitle>
          <HeaderSubtitle>
            Your journey to work starts here — every step counts.
          </HeaderSubtitle>
          <ScenePill>
            {SCENE_LABELS[sceneImageKey] ?? SCENE_LABELS[scene]}
          </ScenePill>
        </HeaderLeft>
        <ResetButton onClick={resetGame} />
      </Header>

      {/* Stats */}
      <TopRow>
        <StatsPanel stats={stats} />
      </TopRow>

      {/* Scene image */}
      <ActivityImage src={SCENE_IMAGES[sceneImageKey]} />

      {renderScene()}
    </Container>
  );
}