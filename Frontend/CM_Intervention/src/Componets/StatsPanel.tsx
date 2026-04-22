import { rcStyles } from "../Static/rockClimbingStyles";
import { addClassNameToProps, Subtitle } from "./Layout";

/**
 * A kind of statistic.
 */
type StatKind = "energy" | "mood" | "confidence" | "health";

/**
 * A set of statistics. Assigns a number between 1 and 100 to each statistic kind.
 */
type Stats = Readonly<Record<StatKind, number>>;

/**
 * An object that represents a change in statistics.
 * A missing key is equivalent to a key with a value of 0.
 */
type StatDelta = Partial<Readonly<Record<StatKind, number>>>;

/**
 * Given an original value, return a clamped value, which is as close to the original value as possible, but is not below the given minimum or above the given maximum.
 * 
 * @param value The original value.
 * @param min The given minimum.
 * @param max The given maximum.
 * @returns The clamped value.
 */
function clamp(value: number, min: number, max: number): number {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

/**
 * Return updated stats given old stats and a stat delta.
 * @param stats The old stats.
 * @param delta The stat delta.
 * @returns The new stats.
 */
function statsUpdate(stats: Stats, delta: StatDelta): Stats {
    return {
        energy: clamp(stats.energy + (delta.energy ?? 0), 0, 100),
        mood: clamp(stats.mood + (delta.mood ?? 0), 0, 100),
        confidence: clamp(stats.confidence + (delta.confidence ?? 0), 0, 100),
        health: clamp(stats.health + (delta.health ?? 0), 0, 100),
    };
}

/**
 * Given two sets of statistics, return a `StatDelta` representing the difference between them.
 * 
 * That is, given `newStats` and `oldStats`, `statsUpdate(oldStats, statsSubtract(newStats, oldStats)) == newStats`.
 * 
 * @param newStats The new statistics.
 * @param oldStats The old statistics.
 * @returns The `StatDelta` representing the difference between the old and new statistics.
 */
function statsSubtract(newStats: Stats, oldStats: Stats): StatDelta {
    return {
        energy: newStats.energy - oldStats.energy,
        mood: newStats.mood - oldStats.mood,
        confidence: newStats.confidence - oldStats.confidence,
        health: newStats.health - oldStats.health,
    };
}

type StatsViewerProps = {
    stats: Stats;
} & Omit<React.ComponentPropsWithoutRef<"section">, "children">;

/**
 * A React component to display an individual item of `StatsViewer`.
 * 
 * @param {Object} props The React component's props.
 * @param props.id An HTML ID.
 * @param props.key A React key, for use in diffing.
 * @param props.label The label of the stat kind of the stat item.
 * @param props.value The value of the stat item.
 * @param props.color The color of the bar.
 * @param props.isPrimary Whether or not this bar should be displayed with extra emphasis.
 * @returns The React component.
 */
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

/**
 * A React component to display a set of statistics.
 * 
 * @param {Object} props The React component's props. In addition to the ones explicitly documented, generic HTML properties, such as `className`, are also supported.
 * @param props.stats The statistics to display.
 * @returns The React component.
 */
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
                isPrimary={true}
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
} & ({ delta: StatDelta } | { newStats: Stats; oldStats: Stats }) &
    Omit<React.ComponentPropsWithoutRef<"div">, "children">;

/**
 * A React component to display a change in statistics.
 * 
 * Normally displayed while given the user feedback.
 * 
 * Either the delta is given by the `delta` prop, or the delta is computed from the `newStats` and `oldStats` props.
 * It is an error for `newStats` or `oldStats` to appear without the other, or for `delta` to coexist with either.
 * That is, { `delta` } and { `newStats`, `oldStats` } are mutually exclusive sets of props.
 * 
 * @param {Object} props The React component's props. In addition to the ones explicitly documented, generic HTML properties, such as `className`, are also supported.
 * @param props.delta The stat delta to display.
 * @param props.newStats The new set of statistics. Mutually exclusive with `props.delta`.
 * @param props.oldStats The old set of statistics. Mutually exclusive with `props.delta`.
 * @returns The React component.
 */
function StatDeltaViewer(props: StatDeltaViewerProps) {
    const { subtitle } = props;
    const delta =
        "newStats" in props && "oldStats" in props
            ? statsSubtract(props.newStats, props.oldStats)
            : props.delta;
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

/**
 * A React component to display an individual item of `StatDeltaViewer`.
 * 
 * @param {Object} props The React component's props.
 * @param props.key A unique identifier for the stat item.
 * @param props.label The name of the stat kind of the stat item.
 * @param props.value A number representing the change of the stat item.
 * @returns The React component.
 */
function StatDeltaItem({ key, label, value }: StatDeltaItemProps) {
    return (
        <li key={key} className={rcStyles.deltaItem}>
            {`${value > 0 ? "+" : ""}${value}`} {label}
        </li>
    );
}

export {
    statsUpdate,
    statsSubtract,
    StatsViewer,
    StatsViewer as StatsPanel,
    StatDeltaViewer,
    type Stats,
    type StatKind,
    type StatDelta,
};
