import { useState } from "react";
import {s} from "../Static/officestyles.js"
const atDeskImg        = "/assets/Images/working.webp";
const legLiftImg       = "/assets/Images/leg_raise.webp";
const standingImg      = "/assets/Images/standing_desk.webp";
const armStretchImg    = "/assets/Images/arm_stretches.webp";
const chairSquatImg    = "/assets/Images/chari_squat.webp";
const walkMeetingImg   = "/assets/Images/walking_meeting.webp";
const waterBreakImg    = "/assets/Images/water_break.webp";
const printerWalkImg   = "/assets/Images/Walking_to_printer.webp";
 "../Static/officestyles.js"

const SCENE_IMAGES = {
  office:          atDeskImg,
  walk:            atDeskImg,
  leglift:         legLiftImg,
  standing:        standingImg,
  deskexercise:    atDeskImg,
  stretch:         armStretchImg,
  chairsquat:      chairSquatImg,
  wrist:           legLiftImg,
  walkmeeting:     walkMeetingImg,
  waterbreak:      waterBreakImg,
  printer:         printerWalkImg,
};


const INITIAL_STATS = { Confidence: 50, Mood: 50, Health: 50, Energy: 100 };
const STAT_COLORS = {
  Confidence: "#facc15",
  Mood:       "#22c55e",
  Health:     "#3b82f6",
  Energy:     "#ef4444",
};
const STAT_KEYS = ["Confidence", "Mood", "Health", "Energy"];

const SCENE_LABELS = {
  office:       "At your desk",
  walk:         "On a walk",
  leglift:      "Sneaky desk workout",
  standing:     "Standing desk mode",
  deskexercise: "Desk exercise time!",
};

const WALK_OPTIONS = [
  {
    id: "walkmeeting",
    label: "Walking meeting",
    intro:
      "You grab your phone and suggest taking the call outside. Fresh air, moving feet, still getting things done — best of both worlds.",
    result:
      "Productive and active? That's the dream combo. Your team loved it too. Let's do that again! 🚶📱",
    delta: { Energy: -6, Mood: +12, Confidence: +12, Health: +8 },
  },
  {
    id: "waterbreak",
    label: "Water break walk",
    intro:
      "You grab your water bottle and take the long way to the kitchen. Hydration plus movement — your body's two favourite things.",
    result:
      "Hydrated and stretched out. That's a double win. Small detour, big payoff. 💧",
    delta: { Energy: -3, Mood: +10, Confidence: +5, Health: +10 },
  },
  {
    id: "printer",
    label: "Walk to the printer",
    intro:
      "You send something to print and take your time getting there. Down the hall, a little loop — every step counts.",
    result:
      "Technically productive, secretly a wellness break. Nobody needs to know. 🖨️",
    delta: { Energy: -2, Mood: +8, Confidence: +4, Health: +6 },
  },
];

const DESK_EXERCISE_OPTIONS = [
  {
    id: "stretch",
    label: "Arm & shoulder stretches",
    intro:
      "You extend your arms wide and roll your shoulders back. Tension you didn't even know was there starts to melt away.",
    result:
      "Those stretches just undid an hour of hunching. Your shoulders are officially grateful. 💪",
    delta: { Energy: -3, Mood: +8, Health: +10, Confidence: +5 },
  },
  {
    id: "chairsquat",
    label: "Chair squats",
    intro:
      "You stand, lower yourself almost to the seat, then rise. Three reps in and you're already feeling it.",
    result:
      "Chair squats — who knew your desk could double as a gym? Legs activated. You did that! 🙌",
    delta: { Energy: -8, Mood: +10, Health: +12, Confidence: +8 },
  },
  {
    id: "wrist",
    label: "Leg raises",
    intro:
      "You lift both legs slowly under the desk, hold for a beat, then lower. Nobody has any idea.",
    result:
      "Sneaky and effective. Core engaged, legs working — all from your chair. Keep it up! ✨",
    delta: { Energy: -5, Mood: +8, Health: +10, Confidence: +6 },
  },
];

const TASKS = [
  {
    id: "walk",
    icon: "🚶",
    name: "Take a Walk",
    desc: "Step outside or lap the office",
    scene: "walk",
    delta: () => ({ Energy: 0, Mood: 0, Confidence: 0, Health: 0 }), 
    intro:
      "You push back from your chair and stand up. Legs? Grateful. Brain? Already less foggy. Where to?",
    result: "",
  },
  {
    id: "standing",
    icon: "🧍",
    name: "Standing Desk",
    desc: "Rise up and keep working",
    scene: "standing",
    delta: () => ({ Energy: -1, Mood: +10, Confidence: +10, Health: +5 }),
    intro:
      "You raise the desk with a soft whirr and shift your weight onto your feet. The posture change alone feels like a tiny reset.",
    result:
      "Posture improved, focus sharpened. You're standing tall — literally! 🧍",
  },
  {
    id: "deskexercise",
    icon: "🏋️",
    name: "Desk Exercises",
    desc: "Move without leaving your seat",
    scene: "deskexercise",
    delta: () => ({ Energy: 0, Mood: 0, Confidence: 0, Health: 0 }), 
    intro:
      "You don't need a gym. You've got a chair, two arms, and two legs — let's use them.",
    result: "",
  },
];

export default function OfficeGame() {
  const [stats, setStats]           = useState(INITIAL_STATS);
  const [scene, setScene]           = useState("office");
  const [step, setStep]             = useState(0);
  const [lastDelta, setLastDelta]   = useState({ Energy: 0, Mood: 0, Confidence: 0, Health: 0 });
  const [resultText, setResultText] = useState("");
  const [activeTask, setActiveTask] = useState(null);
  const [deskOption, setDeskOption] = useState(null);
  const [walkOption, setWalkOption] = useState(null);

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

  const handleTaskChoice = (task) => {
    applyDelta(task.delta());
    setActiveTask(task);
    setScene(task.scene);
    setStep(1);
    setResultText("");
    setDeskOption(null);
    setWalkOption(null);
  };

  const handleConfirm = () => {
    setResultText(activeTask.result);
    setStep(3);
  };

  const handleWalkOption = (option) => {
    applyDelta(option.delta);
    setWalkOption(option);
    setResultText(option.result);
    setStep(3);
  };

  const handleDeskOption = (option) => {
    applyDelta(option.delta);
    setDeskOption(option);
    setResultText(option.result);
    setStep(3);
  };

  const handleDoMoreDesk = () => {
    setDeskOption(null);
    setResultText("");
    setStep(2);
  };

  const backToOffice = () => {
    setScene("office");
    setStep(0);
    setLastDelta({ Energy: 0, Mood: 0, Confidence: 0, Health: 0 });
    setResultText("");
    setActiveTask(null);
    setDeskOption(null);
    setWalkOption(null);
  };

  const resetGame = () => {
    setStats(INITIAL_STATS);
    backToOffice();
  };

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

  const renderScene = () => {

    if (scene === "office") {
      return (
        <div className={s.section}>
          <h2 className={s.title}>The Office</h2>
          <p className={s.paragraph}>
            You've got a moment. What would feel good for your body and mind right now?
          </p>
          <p className={s.paragraph}>
            Every option counts — choose what fits your energy today.
          </p>
          <div className={s.taskGrid}>
            {TASKS.map((t) => (
              <button key={t.id} className={s.taskCard} onClick={() => handleTaskChoice(t)}>
                <span className={s.taskIcon}>{t.icon}</span>
                <span className={s.taskName}>{t.name}</span>
                <span className={s.taskDesc}>{t.desc}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (step === 1 && activeTask) {
      const isDeskEx = activeTask.id === "deskexercise";
      const isWalk   = activeTask.id === "walk";
      return (
        <div className={s.section}>
          <h2 className={s.title}>{activeTask.name}</h2>
          <p className={s.paragraph}>{activeTask.intro}</p>
          {!isDeskEx && !isWalk && (
            <p className={s.paragraph}>No pressure. Any movement is a win.</p>
          )}
          <div className={s.deltaContainer}>
            <h3 className={s.subtitle}>Recent changes</h3>
            <ul className={s.deltaList}>{renderDeltaList()}</ul>
          </div>
          <button
            className={s.primaryButton}
            onClick={() => {
              if (isDeskEx || isWalk) setStep(2);
              else handleConfirm();
            }}
          >
            {isWalk ? "Let's go! 🚶" : isDeskEx ? "Let's go! 💪" : "Continue"}
          </button>
        </div>
      );
    }

    if (step === 2 && activeTask?.id === "walk") {
      return (
        <div className={s.section}>
          <h2 className={s.title}>Where to? 🚶</h2>
          <p className={s.paragraph}>
            Pick your walk — all three count. Go with what feels right.
          </p>
          <div className={s.buttonGroup}>
            {WALK_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                className={s.button}
                onClick={() => handleWalkOption(opt)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (step === 2 && activeTask?.id === "deskexercise") {
      return (
        <div className={s.section}>
          <h2 className={s.title}>Pick your move 🏋️</h2>
          <p className={s.paragraph}>
            What's calling to you right now? All three are great — pick the one that feels right.
          </p>
          <div className={s.buttonGroup}>
            {DESK_EXERCISE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                className={s.button}
                onClick={() => handleDeskOption(opt)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (step === 3) {
      const isDeskEx = activeTask?.id === "deskexercise";
      const isWalk   = activeTask?.id === "walk";
      const activeOption = deskOption || walkOption;

      return (
        <div className={s.section}>
          <h2 className={s.title}>
            {isDeskEx ? "Nailed it! 🎉" : isWalk ? "Nice work! 🚶" : "Afterward"}
          </h2>
          {activeOption && (
            <p className={s.paragraphItalic}>{activeOption.intro}</p>
          )}
          <p className={s.paragraph}>{resultText}</p>
          <div className={s.deltaContainer}>
            <h3 className={s.subtitle}>Recent changes</h3>
            <ul className={s.deltaList}>{renderDeltaList()}</ul>
          </div>
          <div className={s.buttonRow}>
            {isDeskEx && (
              <button className={s.primaryButton} onClick={handleDoMoreDesk}>
                Do another exercise 💪
              </button>
            )}
            <button className={s.secondaryButton} onClick={backToOffice}>
              Back to Desk
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  const sceneImageKey =
    scene === "deskexercise" && deskOption ? deskOption.id
    : scene === "walk"        && walkOption ? walkOption.id
    : scene;

  return (
    <div className={s.container}>

      <div className={s.header}>
        <div className={s.headerLeft}>
          <h1 className={s.mainTitle}>Office Wellness</h1>
          <p className={s.headerSubtitle}>
            Small moves, big difference — choose what feels right today.
          </p>
          <div className={s.scenePill}>{SCENE_LABELS[scene]}</div>
        </div>
        <button className={s.resetButton} onClick={resetGame}>Reset Game</button>
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