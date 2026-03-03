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
                    <progress
                        className="stats-bar"
                        id="stat-bar-energy"
                        max="100"
                        value={stats.energy}
                    ></progress>
                    <span className="stats-number">{stats.energy}%</span>
                </p>
                <p className="stats-item">
                    <span className="stats-label">Mood</span>
                    <progress
                        className="stats-bar"
                        id="stat-bar-mood"
                        max="100"
                        value={stats.mood}
                    ></progress>
                    <span className="stats-number">{stats.mood}%</span>
                </p>
                <p className="stats-item">
                    <span className="stats-label">Confidence</span>
                    <progress
                        className="stats-bar"
                        id="stat-bar-confidence"
                        max="100"
                        value={stats.confidence}
                    ></progress>
                    <span className="stats-number">{stats.confidence}%</span>
                </p>
                <p className="stats-item">
                    <span className="stats-label">Mobility</span>
                    <progress
                        className="stats-bar"
                        id="stat-bar-mobility"
                        max="100"
                        value={stats.mobility}
                    ></progress>
                    <span className="stats-number">{stats.mobility}%</span>
                </p>
            </section>
        </>
    );
}

// ActivityOptions component.
type OptionSpec = {
    id: string;
    label: string;
    onClick: () => void;
};

type ActivityOptionsProps = {
    options: Array<OptionSpec>;
};

function ActivityOptions({ options }: ActivityOptionsProps) {
    return (
        <section className="options">
            {options.map((option) => (
                <button
                    id={option.id}
                    className="options-button"
                    onClick={option.onClick}
                >
                    {option.label}
                </button>
            ))}
        </section>
    );
}

// WalkingActivity component.
type WalkingActivityProps = {
    stats: Stats;
    onStatChange: StatChangeHandler;
};

function WalkingActivity({ stats, onStatChange }: WalkingActivityProps) {
    const options: Array<OptionSpec> = [
        {
            id: "stretch",
            label: "Stretch",
            onClick() {
                onStatChange("mobility", stats.mobility + 5);
            },
        },
        {
            id: "walk",
            label: "Walk",
            onClick() {
                onStatChange("confidence", stats.confidence + 5);
                onStatChange("mood", stats.mood + 5);
                onStatChange("energy", stats.energy + 5);
            },
        },
        {
            id: "run",
            label: "Run",
            onClick() {
                onStatChange("confidence", stats.confidence + 5);
            },
        },
        {
            id: "sprint",
            label: "Sprint",
            onClick() {
                if (stats.mobility >= 10 && stats.energy >= 10) {
                    onStatChange("confidence", stats.confidence + 20);
                    onStatChange("energy", stats.energy - 5);
                } else {
                    onStatChange("confidence", stats.confidence - 5);
                    onStatChange("energy", stats.energy - 20);
                }
            },
        },
    ];
    return (
        <>
            <p>What should I do?</p>
            <ActivityOptions options={options}></ActivityOptions>
        </>
    );
}

// Exports.
export { WalkingActivity, StatsViewer, StatKind, Stats, StatChangeHandler };
