import { rcStyles } from "../Static/rockClimbingStyles";

// Statistics types are defined in this file for now.
type StatKind = "energy" | "mood" | "confidence" | "health";

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
        health: clamp(stats.health + (delta.health ?? 0), 0, 100),
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
    color,
    isPrimary,
}: {
    id: string;
    label: string;
    value: number;
    color: string;
    isPrimary: boolean;
}) {
    return (
        <div className={isPrimary ? rcStyles.statRowPrimary : rcStyles.statRow}>
            <div
                className={
                    isPrimary ? rcStyles.statLabelPrimary : rcStyles.statLabel
                }
            >
                {label}
            </div>
            <div
                className={
                    isPrimary ? rcStyles.barOuterPrimary : rcStyles.barOuter
                }
            >
                <div
                    className={rcStyles.barInner}
                    style={{ width: `${value}%`, backgroundColor: color }}
                />
            </div>
            <div
                className={
                    isPrimary ? rcStyles.statValuePrimary : rcStyles.statValue
                }
            >
                {value}
            </div>
        </div>
    );
}

function StatsViewer({ stats }: StatsViewerProps) {
    return (
        <section className={rcStyles.statsContainer}>
            <div className={rcStyles.statsTitle}>How you&apos;re feeling</div>
            <StatsBar
                id="stat-bar-confidence"
                label="Confidence"
                value={stats.confidence}
                color={"#ef4444"}
                isPrimary={false}
            />
            <StatsBar
                id="stat-bar-mood"
                label="Mood"
                value={stats.mood}
                color={"#22c55e"}
                isPrimary={false}
            />
            <StatsBar
                id="stat-bar-health"
                label="Health"
                value={stats.health}
                color={"#3b82f6"}
                isPrimary={false}
            />
            <StatsBar
                id="stat-bar-energy"
                label="Energy"
                value={stats.energy}
                color={"#facc15"}
                isPrimary={false}
            />
        </section>
    );
}

export { statsUpdate, StatsViewer, Stats, StatKind, StatDelta };
