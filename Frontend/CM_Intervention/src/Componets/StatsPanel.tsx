// Statistics types are defined in this file for now.
type StatKind = "energy" | "mood" | "confidence" | "mobility";

type Stats = Readonly<Record<StatKind, number>>;
type StatDelta = Partial<Readonly<Record<StatKind, number>>>;

function clamp(value: number, min: number, max: number): number {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

function statsUpdate(stats: Stats, delta: StatDelta): Stats {
    return {
        energy: clamp(stats.energy + (delta.energy ?? 0), 0, 100),
        mood: clamp(stats.mood + (delta.mood ?? 0), 0, 100),
        confidence: clamp(stats.confidence + (delta.confidence ?? 0), 0, 100),
        mobility: clamp(stats.mobility + (delta.mobility ?? 0), 0, 100),
    };
}

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

export { statsUpdate, StatsViewer, Stats, StatKind, StatDelta };
