import { useState } from "react";
import "../Static/WalkingActivity.css";

// Statistics types are defined in this file for now.
type StatKind = "energy" | "mood" | "confidence" | "mobility";

type Stats = Readonly<Record<StatKind, number>>;
type StatDelta = Partial<Readonly<Record<StatKind, number>>>;

type StatChangeHandler = (newStats: Stats) => void;

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
    title: string;
    tasks: Array<TaskSpec>;
};

function ActivityTasks({ title, tasks }: ActivityTasksProps) {
    return (
        <>
            <div className="og-tasks-title">{title}</div>
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

const STARTING_STATS: Stats = Object.freeze({
    energy: 50,
    mood: 50,
    confidence: 50,
    mobility: 50,
});

function WalkingActivity({
    stats,
    onStatChange: onStatChange,
}: WalkingActivityProps) {
    function applyStatDelta(delta: StatDelta) {
        onStatChange({
            energy: clamp(stats.energy + (delta.energy ?? 0), 0, 100),
            mood: clamp(stats.mood + (delta.mood ?? 0), 0, 100),
            confidence: clamp(
                stats.confidence + (delta.confidence ?? 0),
                0,
                100,
            ),
            mobility: clamp(stats.mobility + (delta.mobility ?? 0), 0, 100),
        });
    }

    function givePositiveFeedback(message: string) {
        setFeedback(positiveFeedback(message));
    }

    function giveNegativeFeedback(message: string) {
        setFeedback(negativeFeedback(message));
    }

    // Represents the state of the entire component.
    // Goal is to make invalid states unrepresentable using the type system.
    type ScreenState =
        | { screen: "chooseActivity" }
        | { screen: "chooseLocation"; activity: "walk" | "bike" }
        | {
              screen: "game";
              activity: "walk" | "bike";
              location: "neighborhood" | "localPark";
              stats: Stats;
          };

    const [feedback, setFeedback] = useState("");
    const [screenState, setScreenState] = useState<ScreenState>({
        screen: "chooseActivity",
    });

    let tasks: Array<TaskSpec>;
    let tasksPrompt: string;

    if (screenState.screen === "chooseActivity") {
        tasksPrompt = "Choose an Activity";
        tasks = [
            {
                id: "chooseWalking",
                label: "Walking",
                icon: "🚶",
                desc: "Take a relaxing walk",
                action() {
                    setScreenState({
                        screen: "chooseLocation",
                        activity: "walk",
                    });
                },
            },
            {
                id: "chooseBiking",
                label: "Cycling",
                icon: "🚴",
                desc: "Get out your bike and take a stroll",
                action() {
                    setScreenState({
                        screen: "chooseLocation",
                        activity: "bike",
                    });
                },
            },
        ];
    } else if (screenState.screen === "chooseLocation") {
        tasksPrompt = "Choose a Location";
        tasks = [
            {
                id: "chooseNeighborhood",
                label: "Neighborhood",
                icon: "🏠",
                desc: "Take a walk or bike in the neighborhood",
                action() {
                    setScreenState({
                        screen: "game",
                        activity: screenState.activity,
                        location: "neighborhood",
                        stats: STARTING_STATS,
                    });
                },
            },
            {
                id: "chooseLocalPark",
                label: "Local Park",
                icon: "🌳",
                desc: "Take a walk or bike in the local park",
                action() {
                    setScreenState({
                        screen: "game",
                        activity: screenState.activity,
                        location: "localPark",
                        stats: STARTING_STATS,
                    });
                },
            },
        ];
    } else if (screenState.screen === "game") {
        tasksPrompt = "Choose an Action";
        tasks = [];
    } else {
        const _: never = screenState;
        throw new Error();
    }

    return (
        <div className="walking-game">
            {screenState.screen === "game" ? (
                <StatsViewer stats={screenState.stats}></StatsViewer>
            ) : (
                <></>
            )}
            <ActivityTasks title={tasksPrompt} tasks={tasks}></ActivityTasks>
            {feedback ? (
                <div className="og-feedback" key={feedback}>
                    {feedback}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}

// Exports.
export default WalkingActivity;
