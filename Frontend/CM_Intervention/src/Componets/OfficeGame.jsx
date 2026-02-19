import { useState } from "react";
import "./OfficeGame.css";

const INITIAL_STATS = { Energy: 50, Mood: 50, Confidence: 50, Mobility: 40 };

const STAT_KEYS = ["Energy", "Mood", "Confidence", "Mobility"];
const STAT_CLASS = {
  Energy: "energy",
  Mood: "mood",
  Confidence: "confidence",
  Mobility: "mobility",
};

export default function OfficeGame() {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [deltas, setDeltas] = useState({ Energy: 0, Mood: 0, Confidence: 0, Mobility: 0 });
  const [showDeltas, setShowDeltas] = useState(false);
  const [feedback, setFeedback] = useState("");

  const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));

  const applyUpdate = (next, message) => {
    const d = {};
    STAT_KEYS.forEach((k) => {
      d[k] = Math.round(next[k] - (stats[k] || 0));
    });
    setStats(next);
    setDeltas(d);
    setShowDeltas(true);
    setFeedback(message);
    setTimeout(() => setShowDeltas(false), 2200);
  };

  const walk = () => {
    const s = stats;
    applyUpdate(
      {
        Energy: clamp((s.Energy / 100) * 10),
        Mood: clamp(((s.Mood / 100) * 20) + s.Mood),
        Confidence: clamp(((s.Confidence / 100) * 20) + s.Confidence),
        Mobility: clamp(((s.Mobility / 100) * 20) + s.Mobility),
      },
      "You stepped away from the desk for a quick walk. Your body thanks you — blood flowing, head clearing."
    );
  };

  const legLift = () => {
    const s = stats;
    applyUpdate(
      {
        Energy: clamp((s.Energy / 100) * 5),
        Mood: clamp(((s.Mood / 100) * 15) + s.Mood),
        Confidence: clamp(((s.Confidence / 100) * 10) + s.Confidence),
        Mobility: clamp(((s.Mobility / 100) * 20) + s.Mobility),
      },
      "A few seated leg lifts under the desk. Subtle, effective, and nobody even noticed."
    );
  };

  const standingDesk = () => {
    const s = stats;
    applyUpdate(
      {
        Energy: s.Energy,
        Mood: clamp(((s.Mood / 100) * 15) + s.Mood),
        Confidence: clamp(((s.Confidence / 100) * 10) + s.Confidence),
        Mobility: s.Mobility,
      },
      "Switched to the standing desk for a while. Posture improved, focus sharpened."
    );
  };

  const reset = () => {
    setStats(INITIAL_STATS);
    setDeltas({ Energy: 0, Mood: 0, Confidence: 0, Mobility: 0 });
    setShowDeltas(false);
    setFeedback("");
  };

  const tasks = [
    {
      id: "walk",
      className: "walk",
      icon: "🚶",
      name: "Take a Walk",
      desc: "Step outside or lap the office",
      action: walk,
    },
    {
      id: "leglift",
      className: "leglift",
      icon: "🦵",
      name: "Leg Lifts",
      desc: "Sneak in some reps at your desk",
      action: legLift,
    },
    {
      id: "standing",
      className: "standing",
      icon: "🧍",
      name: "Standing Desk",
      desc: "Rise up and keep working",
      action: standingDesk,
    },
  ];

  return (
    <div className="office-game">

      {/* Stats */}
      <div className="og-stats">
        <div className="og-stats-title">Your Stats</div>
        {STAT_KEYS.map((key) => {
          const delta = deltas[key];
          const deltaVisible = showDeltas && delta !== 0;
          const deltaClass = deltaVisible ? "visible " + (delta > 0 ? "pos" : "neg") : (showDeltas ? "visible zero" : "");
          return (
            <div className="stat-row" key={key}>
              <span className="stat-label">{key}</span>
              <div className="stat-track">
                <div
                  className={`stat-fill ${STAT_CLASS[key]}`}
                  style={{ width: `${stats[key]}%` }}
                />
              </div>
              <span className="stat-value">{stats[key]}</span>
              <span className={`stat-delta ${deltaClass}`}>
                {delta > 0 ? `+${delta}` : delta < 0 ? delta : ""}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tasks */}
      <div className="og-tasks-title">Choose an Activity</div>
      <div className="og-tasks">
        {tasks.map((t) => (
          <button
            key={t.id}
            className={`task-card ${t.className}`}
            onClick={t.action}
          >
            <span className="task-icon">{t.icon}</span>
            <span className="task-name">{t.name}</span>
            <span className="task-desc">{t.desc}</span>
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="og-feedback" key={feedback}>
          {feedback}
        </div>
      )}

      <button className="og-reset" onClick={reset}>
        Reset
      </button>
    </div>
  );
}