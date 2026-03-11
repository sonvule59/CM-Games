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
    id?: string;
    title: string;
    tasks: Array<TaskSpec>;
};

function ActivityTasks({ id, title, tasks }: ActivityTasksProps) {
    return (
        <>
            <div className="og-tasks-title">{title}</div>
            <section className="og-tasks" id={id}>
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
type WalkingActivityProps = {};

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

function WalkingActivity({}: WalkingActivityProps) {
    function applyStatDelta(delta: StatDelta) {
        if (screenState.screen !== "game") throw new Error();
        const stats = screenState.stats;
        setScreenState({
            ...screenState,
            stats: {
                energy: clamp(stats.energy + (delta.energy ?? 0), 0, 100),
                mood: clamp(stats.mood + (delta.mood ?? 0), 0, 100),
                confidence: clamp(
                    stats.confidence + (delta.confidence ?? 0),
                    0,
                    100,
                ),
                mobility: clamp(stats.mobility + (delta.mobility ?? 0), 0, 100),
            },
        });
    }

    function givePositiveFeedback(message: string) {
        setFeedback(positiveFeedback(message));
    }

    function giveNegativeFeedback(message: string) {
        setFeedback(negativeFeedback(message));
    }

    function giveNeutralFeedback(message: string) {
        setFeedback(message);
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

    const [feedback, setFeedback] = useState<string | undefined>(undefined);
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
        let lightExerciseLabel;
        let lightExerciseIcon;
        switch (screenState.activity) {
            case "walk":
                lightExerciseLabel = "Walk";
                lightExerciseIcon = "🚶";
                break;
            case "bike":
                lightExerciseLabel = "Bike";
                lightExerciseIcon = "🚴";
                break;
        }

        tasksPrompt = "Choose an Action";
        tasks = [
            {
                id: "break",
                label: "Take Break",
                icon: "⏲️",
                desc: "Take a short break",
                action() {
                    if (screenState.stats.energy == 100) {
                        applyStatDelta({
                            energy: +100,
                            mood: -20,
                            mobility: -10,
                        });
                        giveNegativeFeedback(
                            "You haven't moved in a while, and you're starting to feel bored.",
                        );
                    } else {
                        applyStatDelta({
                            energy: +100,
                            mood: +20,
                            mobility: -10,
                        });
                        if (screenState.stats.mobility >= 10) {
                            givePositiveFeedback(
                                "You feel refreshed and ready.",
                            );
                        } else {
                            giveNeutralFeedback(
                                "You feel refreshed, but not quite prepared. Maybe it's time to stretch.",
                            );
                        }
                    }
                },
            },
            {
                id: "stretch",
                label: "Stretch",
                icon: "🙆",
                action() {
                    if (screenState.stats.energy <= 10) {
                        applyStatDelta({
                            energy: -10,
                            mobility: +20,
                        });
                        giveNegativeFeedback(
                            "You feel exhausted. Maybe it's time to take a short break.",
                        );
                    } else if (screenState.stats.mobility >= 90) {
                        applyStatDelta({
                            energy: -10,
                            mobility: -100,
                            mood: -50,
                            confidence: -50,
                        });
                        giveNegativeFeedback(
                            "You're starting to feel strained. Maybe it's time to work out.",
                        );
                    } else {
                        applyStatDelta({
                            energy: -10,
                            mobility: +50,
                            mood: +10,
                        });
                        givePositiveFeedback("You feel ready to work out.");
                    }
                },
            },
            {
                id: "lightExercise",
                label: lightExerciseLabel,
                icon: lightExerciseIcon,
                action() {
                    if (screenState.stats.energy <= 20) {
                        applyStatDelta({
                            energy: -20,
                            mobility: -10,
                            confidence: -10,
                            mood: -50,
                        });
                        giveNegativeFeedback(
                            "You feel exhausted. Maybe it's time to take a short break.",
                        );
                    } else if (screenState.stats.mobility <= 10) {
                        applyStatDelta({
                            energy: -20,
                            mobility: -10,
                            confidence: -20,
                            mood: -50,
                        });
                        giveNegativeFeedback(
                            "You feel strained. Maybe it's time to stretch.",
                        );
                    } else {
                        let locationSpecificWorkoutFeedback;
                        switch (screenState.location) {
                            case "localPark":
                                locationSpecificWorkoutFeedback = [
                                    "You appreciate the nice weather.",
                                    "You appreciate the birds chirping.",
                                    "Someone walks past you and says hi.",
                                ];
                                break;
                            case "neighborhood":
                                locationSpecificWorkoutFeedback = [
                                    "You see the neighbors, and they say hi.",
                                ];
                                break;
                        }
                        applyStatDelta({
                            energy: -20,
                            mobility: -10,
                            confidence: +50,
                            mood: +10,
                        });
                        givePositiveFeedback(
                            randomElement([
                                "You feel relaxed.",
                                "You feel accomplished.",
                                "You feel proud.",
                                ...locationSpecificWorkoutFeedback,
                            ]),
                        );
                    }
                },
            },
        ];
    } else {
        const _: never = screenState;
        throw new Error();
    }

    return (
        <div className="walking-game">
            {screenState.screen === "game" && (
                <StatsViewer stats={screenState.stats}></StatsViewer>
            )}
            <ActivityTasks title={tasksPrompt} tasks={tasks}></ActivityTasks>
            {feedback != undefined && (
                <div className="og-feedback" key={feedback}>
                    {feedback}
                </div>
            )}
        </div>
    );
}

// Exports.
export default WalkingActivity;
