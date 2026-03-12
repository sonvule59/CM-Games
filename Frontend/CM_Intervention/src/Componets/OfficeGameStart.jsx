import { useState } from "react";

const s = {
  container:
    "max-w-3xl mx-auto my-8 p-6 rounded-2xl bg-gradient-to-br from-amber-50 via-slate-50 to-orange-50 shadow-xl border border-slate-100 font-sans text-slate-900",
  header: "flex items-start justify-between gap-3 mb-3",
  headerLeft: "space-y-1",
  mainTitle: "m-0 text-3xl font-extrabold tracking-tight text-slate-900",
  headerSubtitle: "text-sm text-slate-600",
  resetButton:
    "px-3 py-1 rounded-full border border-amber-200 bg-white/80 text-xs font-medium text-amber-700 shadow-sm cursor-pointer hover:bg-amber-50 hover:border-amber-300 transition-colors",
  scenePill:
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-800 border border-amber-200",

  statsContainer:
    "w-full p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-3",
  statsTitle: "text-xs font-semibold tracking-wide text-slate-500 uppercase mb-1",
  statRow: "flex items-center gap-3",
  statLabel: "w-28 text-[11px] font-semibold uppercase tracking-wide text-slate-600",
  barOuter: "flex-1 h-3 rounded-full bg-slate-100 overflow-hidden",
  barInner: "h-full rounded-full transition-[width] duration-200 ease-out",
  statValue: "w-10 text-right text-[11px] tabular-nums text-slate-700",

  section: "mt-6",
  title: "m-0 mb-2 text-xl font-bold text-slate-900",
  subtitle: "m-0 mb-1 text-sm font-semibold text-slate-800",
  paragraph: "my-1 mb-2 text-sm leading-relaxed text-slate-700",

  buttonGroup: "flex flex-col gap-2 mt-3",
  button:
    "px-3 py-2 rounded-lg border-0 bg-blue-500 text-white cursor-pointer text-sm text-left shadow-sm hover:bg-blue-600 transition-colors",
  primaryButton:
    "mt-3 px-4 py-2 rounded-lg border-0 bg-amber-500 text-white cursor-pointer text-sm shadow-sm hover:bg-amber-600 transition-colors",
  secondaryButton:
    "mt-3 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 cursor-pointer text-sm hover:bg-slate-50 transition-colors",

  deltaContainer: "mt-2 p-3 rounded-xl bg-sky-50 border border-sky-100",
  deltaList: "m-0 pl-5 text-xs text-slate-700",
  deltaItem: "mb-1",

  taskGrid: "grid grid-cols-3 gap-3 mt-3",
  taskCard:
    "flex flex-col items-center gap-1 p-4 rounded-xl border border-slate-200 bg-white shadow-sm cursor-pointer hover:shadow-md hover:border-amber-300 transition-all text-center",
  taskIcon: "text-3xl",
  taskName: "text-sm font-semibold text-slate-800",
  taskDesc: "text-[11px] text-slate-500 leading-snug",
};

// ── Constants ────────────────────────────────────────────────────────────────
const INITIAL_STATS = { Energy: 50, Mood: 50, Confidence: 50, Mobility: 40 };
const STAT_COLORS = {
  Energy: "#facc15",
  Mood: "#22c55e",
  Confidence: "#ef4444",
  Mobility: "#3b82f6",
};
const STAT_KEYS = ["Energy", "Mood", "Confidence", "Mobility"];

const SCENE_LABELS = {
  office: "At your desk",
  walk: "On a walk",
  leglift: "Sneaky desk workout",
  standing: "Standing desk mode",
};

const TASKS = [
  {
    id: "walk",
    icon: "🚶",
    name: "Take a Walk",
    desc: "Step outside or lap the office",
    scene: "walk",
    delta: (s) => ({
      Energy: Math.round((s.Energy / 100) * 10) - s.Energy,
      Mood: Math.round((s.Mood / 100) * 20),
      Confidence: Math.round((s.Confidence / 100) * 20),
      Mobility: Math.round((s.Mobility / 100) * 20),
    }),
    result:
      "You stepped away from the desk for a quick walk. Blood flowing, head clearing — your body thanks you.",
  },
  {
    id: "leglift",
    icon: "🦵",
    name: "Leg Lifts",
    desc: "Sneak in some reps at your desk",
    scene: "leglift",
    delta: (s) => ({
      Energy: Math.round((s.Energy / 100) * 5) - s.Energy,
      Mood: Math.round((s.Mood / 100) * 15),
      Confidence: Math.round((s.Confidence / 100) * 10),
      Mobility: Math.round((s.Mobility / 100) * 20),
    }),
    result:
      "A few seated leg lifts under the desk. Subtle, effective, and nobody even noticed.",
  },
  {
    id: "standing",
    icon: "🧍",
    name: "Standing Desk",
    desc: "Rise up and keep working",
    scene: "standing",
    delta: (s) => ({
      Energy: 0,
      Mood: Math.round((s.Mood / 100) * 15),
      Confidence: Math.round((s.Confidence / 100) * 10),
      Mobility: 0,
    }),
    result:
      "Switched to the standing desk for a while. Posture improved, focus sharpened.",
  },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function OfficeGame() {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [scene, setScene] = useState("office");
  const [step, setStep] = useState(0); // 0 = lobby, 1 = activity intro, 3 = result
  const [lastDelta, setLastDelta] = useState({ Energy: 0, Mood: 0, Confidence: 0, Mobility: 0 });
  const [resultText, setResultText] = useState("");
  const [activeTask, setActiveTask] = useState(null);

  const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));

  const applyDelta = (delta) => {
    setStats((prev) => {
      const next = {};
      STAT_KEYS.forEach((k) => (next[k] = clamp(prev[k] + (delta[k] || 0))));
      return next;
    });
    setLastDelta({ Energy: delta.Energy || 0, Mood: delta.Mood || 0, Confidence: delta.Confidence || 0, Mobility: delta.Mobility || 0 });
  };

  const handleTaskChoice = (task) => {
    const delta = task.delta(stats);
    applyDelta(delta);
    setActiveTask(task);
    setScene(task.scene);
    setStep(1);
    setResultText("");
  };

  const handleConfirm = () => {
    setResultText(activeTask.result);
    setStep(3);
  };

  const backToOffice = () => {
    setScene("office");
    setStep(0);
    setLastDelta({ Energy: 0, Mood: 0, Confidence: 0, Mobility: 0 });
    setResultText("");
    setActiveTask(null);
  };

  const resetGame = () => {
    setStats(INITIAL_STATS);
    backToOffice();
  };

  // ── Delta list ──
  const renderDeltaList = () => {
    const items = STAT_KEYS.filter((k) => lastDelta[k] !== 0).map((k) => {
      const v = lastDelta[k];
      return (
        <li key={k} className={s.deltaItem}>
          {v > 0 ? "+" : ""}{v} {k}
        </li>
      );
    });
    return items.length ? items : <li className={s.deltaItem}>No recent changes.</li>;
  };

  // ── Stat bars ──
  const renderStatsBar = (label, value, color) => (
    <div className={s.statRow} key={label}>
      <div className={s.statLabel}>{label}</div>
      <div className={s.barOuter}>
        <div className={s.barInner} style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <div className={s.statValue}>{value}</div>
    </div>
  );

  // ── Scene content ──
  const renderScene = () => {
    if (scene === "office") {
      return (
        <div className={s.section}>
          <h2 className={s.title}>The Office</h2>
          <p className={s.paragraph}>
            You're at your desk. The day stretches ahead — meetings, emails, the usual hum. But right now
            you have a moment. What would feel good for your body and mind?
          </p>
          <p className={s.paragraph}>
            Every option here counts. Choose whatever fits your energy and capacity right now.
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
      const intros = {
        walk: "You push back from your chair and head out. The corridor opens up, or maybe it's outside — either way, your legs are grateful for the movement.",
        leglift: "You keep your screen expression neutral while quietly engaging your legs beneath the desk. A small, private act of care.",
        standing: "You raise the desk with a soft whirr and shift your weight onto your feet. The posture change alone feels like a tiny reset.",
      };
      return (
        <div className={s.section}>
          <h2 className={s.title}>{activeTask.name}</h2>
          <p className={s.paragraph}>{intros[activeTask.id]}</p>
          <p className={s.paragraph}>
            There's no pressure to do this perfectly. Any amount of movement is a win.
          </p>
          <div className={s.deltaContainer}>
            <h3 className={s.subtitle}>Recent changes</h3>
            <ul className={s.deltaList}>{renderDeltaList()}</ul>
          </div>
          <button className={s.primaryButton} onClick={handleConfirm}>
            Continue
          </button>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className={s.section}>
          <h2 className={s.title}>Afterward</h2>
          <p className={s.paragraph}>{resultText}</p>
          <div className={s.deltaContainer}>
            <h3 className={s.subtitle}>Recent changes</h3>
            <ul className={s.deltaList}>{renderDeltaList()}</ul>
          </div>
          <button className={s.secondaryButton} onClick={backToOffice}>
            Back to Desk
          </button>
        </div>
      );
    }

    return null;
  };

  // ── Scene emoji banner ──
  const sceneEmoji = { office: "🏢", walk: "🚶", leglift: "🦵", standing: "🧍" };

  return (
    <div className={s.container}>
      {/* Header */}
      <div className={s.header}>
        <div className={s.headerLeft}>
          <h1 className={s.mainTitle}>Office Wellness</h1>
          <p className={s.headerSubtitle}>
            Small moves, big difference — choose what feels right today.
          </p>
          <div className={s.scenePill}>{SCENE_LABELS[scene]}</div>
        </div>
        <button className={s.resetButton} onClick={resetGame}>
          Reset Game
        </button>
      </div>

      {/* Stats */}
      <div className="mt-3 mb-5">
        <div className={s.statsContainer}>
          <div className={s.statsTitle}>How you're feeling</div>
          {STAT_KEYS.map((k) => renderStatsBar(k, stats[k], STAT_COLORS[k]))}
        </div>
      </div>

      {/* Scene banner */}
      <div className="w-full rounded-2xl overflow-hidden bg-amber-100 border border-amber-200 shadow-sm flex items-center justify-center"
           style={{ height: 120, fontSize: 72 }}>
        {sceneEmoji[scene]}
      </div>

      {/* Scene content */}
      {renderScene()}
    </div>
  );
}