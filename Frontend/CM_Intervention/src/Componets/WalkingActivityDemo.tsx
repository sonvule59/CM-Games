import { useState } from "react";
import { WalkingActivity, StatKind, StatsViewer } from "./WalkingActivity.tsx";

function WalkingActivityDemo() {
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
        <>
            <StatsViewer stats={stats}></StatsViewer>
            <WalkingActivity
                stats={stats}
                onStatChange={onStatChange}
            ></WalkingActivity>
        </>
    );
}

export default WalkingActivityDemo;
