import { rcStyles } from "../Static/rockClimbingStyles";
import { addClassNameToProps, Subtitle } from "./Layout";

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
} & React.ComponentPropsWithoutRef<"section">;

function StatsBar({
    id,
    key,
    label,
    value,
    color,
    isPrimary,
}: {
    id: string;
    key?: React.Key;
    label: string;
    value: number;
    color: string;
    isPrimary: boolean;
}) {
    return (
        <div
            id={id}
            key={key}
            className={isPrimary ? rcStyles.statRowPrimary : rcStyles.statRow}
        >
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

function StatsViewer(props: StatsViewerProps) {
    const { stats } = props;
    return (
        <section {...addClassNameToProps(props, rcStyles.statsContainer)}>
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

type StatDeltaViewerProps = {
    subtitle?: React.ReactNode;
    delta: StatDelta;
} & React.ComponentPropsWithoutRef<"div">;
function StatDeltaViewer(props: StatDeltaViewerProps) {
    const { subtitle, delta } = props;
    return (
        <div {...addClassNameToProps(props, rcStyles.deltaContainer)}>
            {subtitle != undefined ? <Subtitle>{subtitle}</Subtitle> : <></>}
            <ul className={rcStyles.deltaList}>
                {delta.confidence ||
                delta.mood ||
                delta.health ||
                delta.energy ? (
                    <>
                        {delta.confidence ? (
                            <StatDeltaItem
                                key={"confidence"}
                                label={"Confidence"}
                                value={delta.confidence}
                            />
                        ) : (
                            <></>
                        )}
                        {delta.mood ? (
                            <StatDeltaItem
                                key={"mood"}
                                label={"Mood"}
                                value={delta.mood}
                            />
                        ) : (
                            <></>
                        )}
                        {delta.health ? (
                            <StatDeltaItem
                                key={"health"}
                                label={"Health"}
                                value={delta.health}
                            />
                        ) : (
                            <></>
                        )}
                        {delta.energy ? (
                            <StatDeltaItem
                                key={"energy"}
                                label={"Energy"}
                                value={delta.energy}
                            />
                        ) : (
                            <></>
                        )}
                    </>
                ) : (
                    <li className={rcStyles.deltaItem}>No recent changes.</li>
                )}
            </ul>
        </div>
    );
}

type StatDeltaItemProps = { key: string; label: string; value: number };
function StatDeltaItem({ key, label, value }: StatDeltaItemProps) {
    return (
        <li key={key} className={rcStyles.deltaItem}>
            {`${value > 0 ? "+" : ""}${value}`} {label}
        </li>
    );
}

export {
    statsUpdate,
    StatsViewer,
    StatDeltaViewer,
    Stats,
    StatKind,
    StatDelta,
};
