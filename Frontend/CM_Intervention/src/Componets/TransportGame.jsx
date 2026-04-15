import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { s } from "../Static/officestyles.js";

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
const INITIAL_STATS = { Confidence: 50, Mood: 50, Health: 50, Energy: 100 };
const STAT_COLORS = {
  Confidence: "#facc15",
  Mood:       "#22c55e",
  Health:     "#3b82f6",
  Energy:     "#ef4444",
};
const STAT_KEYS = ["Confidence", "Mood", "Health", "Energy"];

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
  const [lastDelta, setLastDelta]   = useState({ Energy: 0, Mood: 0, Confidence: 0, Health: 0 });
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
      Energy:     delta.Energy     || 0,
      Mood:       delta.Mood       || 0,
      Confidence: delta.Confidence || 0,
      Health:     delta.Health     || 0,
    });
  };

  const resetGame = () => {
    setStats(INITIAL_STATS);
    setScene("start");
    setStep(0);
    setLastDelta({ Energy: 0, Mood: 0, Confidence: 0, Health: 0 });
    setResultText("");
    setTransitChoice(null);
    setWaitChoice(null);
    setCommuteMode(null);
  };

  // ── Mode selection ──────────────────────────────────────────────────────────
  const handleModeChoice = (mode) => {
    setCommuteMode(mode);
    if (mode === "walk") {
      applyDelta({ Energy: -8, Mood: +12, Confidence: +10, Health: +15 });
      setScene("walk");
      setStep(1);
    } else if (mode === "bike") {
      applyDelta({ Energy: -10, Mood: +15, Confidence: +12, Health: +18 });
      setScene("bike");
      setStep(1);
    } else if (mode === "transit") {
      applyDelta({ Energy: -3, Mood: +6, Confidence: +5, Health: +5 });
      setScene("transit");
      setStep(1);
    }
  };

  // ── Transit: stairs vs escalator ───────────────────────────────────────────
  const handleStairsChoice = (choice) => {
    setTransitChoice(choice);
    if (choice === "stairs") {
      applyDelta({ Energy: -5, Mood: +8, Confidence: +8, Health: +12 });
      setScene("stairs");
      setStep(3); // → stairs result → then wait choice
      setResultText("You take the stairs at your own pace, one step at a time. Your legs wake up and your heart rate lifts just enough to feel good.");
    } else {
      applyDelta({ Energy: -1, Mood: +4, Confidence: +3, Health: +2 });
      setScene("transit");
      setStep(3);
      setResultText("You take the escalator, standing to the right. No rush — you're saving energy for the day ahead. That's a valid choice too.");
    }
  };

  // ── Transit: walk the platform vs stand ────────────────────────────────────
  const handleWaitChoice = (choice) => {
    setWaitChoice(choice);
    if (choice === "walk") {
      applyDelta({ Energy: -3, Mood: +10, Confidence: +6, Health: +8 });
      setScene("subwaywait");
      setStep(5);
      setResultText("You pace the platform gently, earphones in, watching the tunnel. Movement while you wait — every bit counts. 🚇");
    } else {
      applyDelta({ Energy: +2, Mood: +6, Confidence: +4, Health: +2 });
      setScene("subwaywait");
      setStep(5);
      setResultText("You find a bench and sit, breathing slowly. Rest is productive too. You arrive calm and ready. 🧘");
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const renderDeltaList = () => {
    const items = STAT_KEYS.filter((k) => lastDelta[k] !== 0).map((k) => {
      const v = lastDelta[k];
      return (
        <li key={k} className={s.deltaItem}>
          {v > 0 ? "+" : ""}{v} {k}
        </li>
      );
    });
    return items.length
      ? items
      : <li className={s.deltaItem}>No recent changes.</li>;
  };

  const renderStatsBar = (label, value, color) => (
    <div className={s.statRow} key={label}>
      <div className={s.statLabel}>{label}</div>
      <div className={s.barOuter}>
        <div className={s.barInner} style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <div className={s.statValue}>{value}</div>
    </div>
  );

  // ── Scene renderer ──────────────────────────────────────────────────────────
  const renderScene = () => {

    // ── Step 0: Choose your commute ──
    if (step === 0) {
      return (
        <div className={s.section}>
          <h2 className={s.title}>How are you getting in today?</h2>
          <p className={s.paragraph}>
            Every commute is a chance to move your body. Pick what works for you — there's no wrong answer.
          </p>
          <div className={s.buttonGroup}>
            {[
              { id: "walk",    icon: "🚶", name: "Walk",    desc: "Fresh air, your pace" },
              { id: "bike",    icon: "🚴", name: "Bike",    desc: "Two wheels, good vibes" },
              { id: "transit", icon: "🚇", name: "Transit", desc: "Bus or subway" },
            ].map((m) => (
              <button key={m.id} className={s.button} onClick={() => handleModeChoice(m.id)}>
                {m.name}: {m.desc}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // ── Walk: step 1 (intro + result) ──
    if (scene === "walk" && step === 1) {
      return (
        <div className={s.section}>
          <h2 className={s.title}>Walking to Work 🚶</h2>
          <p className={s.paragraph}>
            You step outside and the morning air hits your face. No screen, no seat — just you and the pavement.
            Your body is already thanking you.
          </p>
          <p className={s.paragraph}>
            You take your time, noticing things you'd miss from a window. A good start to the day.
          </p>
          <div className={s.deltaContainer}>
            <h3 className={s.subtitle}>Recent changes</h3>
            <ul className={s.deltaList}>{renderDeltaList()}</ul>
          </div>
          <button className={s.primaryButton} onClick={() => setStep(99)}>
            You've arrived! 🏢
          </button>
        </div>
      );
    }

    // ── Bike: step 1 (intro + result) ──
    if (scene === "bike" && step === 1) {
      return (
        <div className={s.section}>
          <h2 className={s.title}>Cycling In 🚴</h2>
          <p className={s.paragraph}>
            You clip in and push off. The bike lane opens up and you find your rhythm — legs turning,
            wind at your back, brain fully awake before you've even had coffee.
          </p>
          <p className={s.paragraph}>
            This is the good stuff. Body moving, mind clear, arriving with energy to spare.
          </p>
          <div className={s.deltaContainer}>
            <h3 className={s.subtitle}>Recent changes</h3>
            <ul className={s.deltaList}>{renderDeltaList()}</ul>
          </div>
          <button className={s.primaryButton} onClick={() => setStep(99)}>
            You've arrived! 🏢
          </button>
        </div>
      );
    }

    // ── Transit: step 1 — walking to bus stop ──
    if (scene === "transit" && step === 1) {
      return (
        <div className={s.section}>
          <h2 className={s.title}>Heading to the Bus Stop 🚌</h2>
          <p className={s.paragraph}>
            You grab your bag and head out. The walk to the stop is short but it counts —
            legs moving, fresh air, easing into the day.
          </p>
          <div className={s.deltaContainer}>
            <h3 className={s.subtitle}>Recent changes</h3>
            <ul className={s.deltaList}>{renderDeltaList()}</ul>
          </div>
          <button className={s.primaryButton} onClick={() => setStep(2)}>
            You're at the subway 🚇
          </button>
        </div>
      );
    }

    // ── Transit: step 2 — stairs or escalator ──
    if (scene === "transit" && step === 2) {
      return (
        <div className={s.section}>
          <h2 className={s.title}>Stairs or escalator? 🚇</h2>
          <p className={s.paragraph}>
            You're at the entrance. Both get you down — one just works a little harder for you.
            What feels right today?
          </p>
          <div className={s.buttonGroup}>
            <button className={s.button} onClick={() => handleStairsChoice("stairs")}>
              Take the stairs
            </button>
            <button className={s.button} onClick={() => handleStairsChoice("escalator")}>
              Take the escalator
            </button>
          </div>
        </div>
      );
    }

    // ── Transit: step 3 — stairs/escalator result → ask about waiting ──
    if ((scene === "stairs" || scene === "transit") && step === 3) {
      return (
        <div className={s.section}>
          <h2 className={s.title}>
            {transitChoice === "stairs" ? "Nice work! 💪" : "On your way down"}
          </h2>
          <p className={s.paragraph}>{resultText}</p>
          <div className={s.deltaContainer}>
            <h3 className={s.subtitle}>Recent changes</h3>
            <ul className={s.deltaList}>{renderDeltaList()}</ul>
          </div>
          <button className={s.primaryButton} onClick={() => setStep(4)}>
            Now wait for the train 🚇
          </button>
        </div>
      );
    }

    // ── Transit: step 4 — walk the platform or stand? ──
    if (step === 4) {
      return (
        <div className={s.section}>
          <h2 className={s.title}>While you wait… 🚇</h2>
          <p className={s.paragraph}>
            The train's a few minutes away. The platform stretches out in both directions.
            What do you feel like doing?
          </p>
          <div className={s.buttonGroup}>
            <button className={s.button} onClick={() => handleWaitChoice("walk")}>
              Walk up and down the platform
            </button>
            <button className={s.button} onClick={() => handleWaitChoice("stand")}>
              Find a spot and rest
            </button>
          </div>
        </div>
      );
    }

    // ── Transit: step 5 — platform result → arrived ──
    if (scene === "subwaywait" && step === 5) {
      return (
        <div className={s.section}>
          <h2 className={s.title}>On the train! 🚇</h2>
          <p className={s.paragraph}>{resultText}</p>
          <div className={s.deltaContainer}>
            <h3 className={s.subtitle}>Recent changes</h3>
            <ul className={s.deltaList}>{renderDeltaList()}</ul>
          </div>
          <button className={s.primaryButton} onClick={() => setStep(99)}>
            You've arrived! 🏢
          </button>
        </div>
      );
    }

    // ── Step 99: Arrived! ──
    if (step === 99) {
      const modeEmoji = { walk: "🚶", bike: "🚴", transit: "🚇" };
      return (
        <div className={s.section}>
          <h2 className={s.title}>You made it! {modeEmoji[commuteMode]} 🏢</h2>
          <p className={s.paragraph}>
            You're here, you moved your body to get here, and that already puts you ahead.
            Time to take on the day.
          </p>
          <div className={s.deltaContainer}>
            <h3 className={s.subtitle}>How you arrived</h3>
            <ul className={s.deltaList}>
              {STAT_KEYS.map((k) => (
                <li key={k} className={s.deltaItem}>
                  {k}: {stats[k]}
                </li>
              ))}
            </ul>
          </div>
          <div className={s.buttonRow}>
            <button className={s.primaryButton} onClick={() => navigate("/office/game")}>
              Head to the office 💼
            </button>
            <button className={s.secondaryButton} onClick={resetGame}>
              Try a different commute
            </button>
          </div>
        </div>
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
    <div className={s.container}>

      {/* Header */}
      <div className={s.header}>
        <div className={s.headerLeft}>
          <h1 className={s.mainTitle}>The Commute</h1>
          <p className={s.headerSubtitle}>
            Your journey to work starts here — every step counts.
          </p>
          <div className={s.scenePill}>{SCENE_LABELS[sceneImageKey] ?? SCENE_LABELS[scene]}</div>
        </div>
        <button className={s.resetButton} onClick={resetGame}>Reset</button>
      </div>

      {/* Stats */}
      <div className={s.topRow}>
        <div className={s.statsContainer}>
          <div className={s.statsTitle}>How you're feeling</div>
          {STAT_KEYS.map((k) => renderStatsBar(k, stats[k], STAT_COLORS[k]))}
        </div>
      </div>

      {/* Scene image */}
      <div className={s.sceneImageWrap}>
        <img
          src={SCENE_IMAGES[sceneImageKey]}
          alt=""
          className={s.sceneImage}
        />
      </div>

      {renderScene()}
    </div>
  );
}