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

function StatsViewer({ stats }: StatsViewerProps) {
    return (
        <>
            <section className="stats-viewer">
                <p className="stats-item">
                    <span className="stats-label">Energy</span>
                    <meter
                        className="stats-bar"
                        id="stat-bar-energy"
                        max="100"
                        value={stats.energy}
                    ></meter>
                    <span className="stats-number">{stats.energy}%</span>
                </p>
                <p className="stats-item">
                    <span className="stats-label">Mood</span>
                    <meter
                        className="stats-bar"
                        id="stat-bar-mood"
                        max="100"
                        value={stats.mood}
                    ></meter>
                    <span className="stats-number">{stats.mood}%</span>
                </p>
                <p className="stats-item">
                    <span className="stats-label">Confidence</span>
                    <meter
                        className="stats-bar"
                        id="stat-bar-confidence"
                        max="100"
                        value={stats.confidence}
                    ></meter>
                    <span className="stats-number">{stats.confidence}%</span>
                </p>
                <p className="stats-item">
                    <span className="stats-label">Mobility</span>
                    <meter
                        className="stats-bar"
                        id="stat-bar-mobility"
                        max="100"
                        value={stats.mobility}
                    ></meter>
                    <span className="stats-number">{stats.mobility}%</span>
                </p>
            </section>
        </>
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

function WalkingActivity({ stats, onStatChange }: WalkingActivityProps) {
    const [feedback, setFeedback] = useState("");
    const tasks: Array<TaskSpec> = [
        {
            id: "break",
            label: "Break",
            icon: "😮‍💨",
            desc: "Take a short break",
            action() {
                onStatChange("energy", Math.min(stats.energy + 50, 100));
                if (stats.energy <= 80) {
                    onStatChange("mood", Math.min(stats.mood + 20, 80));
                    setFeedback(
                        positiveFeedback(
                            "After you've relaxed, you feel much better.",
                        ),
                    );
                } else {
                    onStatChange("mood", Math.max(0, stats.mood - 10));
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
                onStatChange("mobility", stats.mobility + 5);
            },
        },
        {
            id: "walk",
            label: "Walk",
            icon: "🚶",
            desc: "Take a relaxing walk",
            action() {
                onStatChange("confidence", stats.confidence + 5);
                onStatChange("mood", stats.mood + 5);
                onStatChange("energy", stats.energy + 5);
            },
        },
        {
            id: "run",
            label: "Run",
            icon: "🏃",
            desc: "Run for a little bit",
            action() {
                onStatChange("confidence", stats.confidence + 5);
                onStatChange("energy", stats.energy - 10);
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

// Exports.
export { WalkingActivity, StatsViewer, StatKind, Stats, StatChangeHandler };
