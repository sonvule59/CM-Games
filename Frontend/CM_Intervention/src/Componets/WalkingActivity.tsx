import { useState } from "react";
import "../Static/WalkingActivity.css";

// Statistics types are defined in this file for now.
type StatKind = "energy" | "mood" | "confidence" | "mobility";

type Stats = Record<StatKind, number>;

type StatChangeHandler = (kind: StatKind, newValue: number) => void;

// StatsViewer component.
type StatsViewerProps = {
    stats: Stats;
};

function StatsBar({
    id,
    label,
    value,
}: {
    id: string;
    label: string;
    value: number;
}) {
    return (
        <p className="stats-item">
            <span className="stats-label">{label}</span>
            <meter
                className="stats-bar"
                id={id}
                max={100}
                value={value}
            ></meter>
            <span className="stats-number">{value}%</span>
        </p>
    );
}

function StatsViewer({ stats }: StatsViewerProps) {
    return (
        <section className="stats-viewer">
            <StatsBar
                id="stat-bar-energy"
                label="Energy"
                value={stats.energy}
            />
            <StatsBar id="stat-bar-mood" label="Mood" value={stats.mood} />
            <StatsBar
                id="stat-bar-confidence"
                label="Confidence"
                value={stats.confidence}
            />
            <StatsBar
                id="stat-bar-mobility"
                label="Mobility"
                value={stats.mobility}
            />
        </section>
    );
}

// ActivityTasks component.
type TaskSpec = {
    id: string;
    className?: string;
    label: string;
    icon?: string;
    desc?: string;
    action: () => void;
};

type ActivityTasksProps = {
    tasks: Array<TaskSpec>;
};

function ActivityTasks({ tasks }: ActivityTasksProps) {
    return (
        <>
            <div className="og-tasks-title">Choose an Activity</div>
            <section className="og-tasks">
                {tasks.map((task) => (
                    <button
                        key={task.id}
                        className={`task-card ${task.className ?? ""}`}
                        onClick={task.action}
                    >
                        {task.icon === undefined ? (
                            <></>
                        ) : (
                            <span className="task-icon">{task.icon}</span>
                        )}
                        <span className="task-name">{task.label}</span>
                        {task.desc === undefined ? (
                            <></>
                        ) : (
                            <span className="task-desc">{task.desc}</span>
                        )}
                    </button>
                ))}
            </section>
        </>
    );
}

// WalkingActivity component.
type WalkingActivityProps = {
    stats: Stats;
    onStatChange: StatChangeHandler;
};

const POSITIVE_FEEDBACK_MESSAGES: readonly string[] = [
    "Good job!",
    "Well done!",
    "Awesome!",
    "Great work!",
    "Way to go!",
    "Congratulations!",
];
const NEGATIVE_FEEDBACK_MESSAGES: readonly string[] = ["Oh no!", "Uh oh!"];

function randomElement<T>(array: readonly T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function positiveFeedback(message: string): string {
    return `${randomElement(POSITIVE_FEEDBACK_MESSAGES)} ${message}`;
}

function negativeFeedback(message: string): string {
    return `${randomElement(NEGATIVE_FEEDBACK_MESSAGES)} ${message}`;
}

function clamp(value: number, min: number, max: number): number {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

function WalkingActivityScene({ stats, onStatChange }: WalkingActivityProps) {
    const [feedback, setFeedback] = useState("");
    const tasks: Array<TaskSpec> = [
        {
            id: "break",
            label: "Break",
            icon: "😮‍💨",
            desc: "Take a short break",
            action() {
                onStatChange("energy", clamp(stats.energy + 50, 0, 100));
                if (stats.energy <= 80) {
                    onStatChange("mood", clamp(stats.mood + 20, 0, 80));
                    setFeedback(
                        positiveFeedback(
                            "After you've relaxed, you feel much better.",
                        ),
                    );
                } else {
                    onStatChange("mood", clamp(stats.mood - 10, 0, 100));
                    setFeedback(
                        negativeFeedback(
                            "You haven't done anything in a while, and you're starting to feel demotivated.",
                        ),
                    );
                }
            },
        },
        {
            id: "stretch",
            label: "Stretch",
            icon: "🙆",
            desc: "Take a stretch",
            action() {
                onStatChange("mobility", clamp(stats.mobility + 5, 0, 100));
            },
        },
        {
            id: "walk",
            label: "Walk",
            icon: "🚶",
            desc: "Take a relaxing walk",
            action() {
                onStatChange("confidence", clamp(stats.confidence + 5, 0, 100));
                onStatChange("mood", clamp(stats.mood + 5, 0, 100));
                onStatChange("energy", clamp(stats.energy - 10, 0, 100));
            },
        },
        {
            id: "run",
            label: "Run",
            icon: "🏃",
            desc: "Run for a little bit",
            action() {
                onStatChange("confidence", clamp(stats.confidence + 5, 0, 100));
                onStatChange("energy", clamp(stats.energy - 50, 0, 100));
            },
        },
    ];
    return (
        <>
            <ActivityTasks tasks={tasks}></ActivityTasks>
            {feedback && (
                <div className="og-feedback" key={feedback}>
                    {feedback}
                </div>
            )}
        </>
    );
}

function WalkingActivity() {
    const [stats, setStats] = useState({
        energy: 0,
        mood: 0,
        confidence: 0,
        mobility: 0,
    });

    let currentStats = stats;

    function onStatChange(kind: StatKind, newValue: number) {
        currentStats = { ...currentStats, [kind]: newValue };
        setStats(currentStats);
    }

    return (
        <div className="walking-game">
            <StatsViewer stats={stats}></StatsViewer>
            <WalkingActivityScene
                stats={stats}
                onStatChange={onStatChange}
            ></WalkingActivityScene>
        </div>
    );
}

// Exports.
export default WalkingActivity;
