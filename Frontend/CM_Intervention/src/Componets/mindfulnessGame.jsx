import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { rcStyles } from "../Static/rockClimbingStyles";
import { ActionPanel } from "./ActionPanel.tsx";
import { statsUpdate, StatsPanel } from "./StatsPanel.tsx";

const INITIAL_STATS = {
    confidence: 50,
    mood: 50,
    health: 50,
    energy: 50,
};

/** Short phrase (button) and fuller meaning (shown after you tap). */
const PHRASES = [
    {
        id: "focus-feel",
        label: "I can focus on how I feel",
        explanation:
            "Shifts attention from external appearance to internal sensations, encouraging mindfulness and self-acceptance.",
        delta: { mood: 6, health: 4, confidence: 4, energy: 2 },
    },
    {
        id: "small-steps",
        label: "Every small step counts",
        explanation:
            "Reinforces the idea that even small actions are valuable and contribute to progress.",
        delta: { confidence: 6, mood: 4, energy: 3 },
    },
    {
        id: "go-slow",
        label: "It's okay to go slow",
        explanation:
            "Promotes self-compassion and reduces the pressure to perform at a certain level.",
        delta: { mood: 7, health: 3, energy: 4 },
    },
    {
        id: "body-kindness",
        label: "My body deserves kindness",
        explanation:
            "Encourages a nurturing mindset that supports engaging in physical activity.",
        delta: { health: 6, mood: 5, confidence: 5 },
    },
    {
        id: "calmer-moving",
        label: "I feel calmer after moving",
        explanation:
            "Highlights the emotional benefits of movement, reinforcing a positive association.",
        delta: { mood: 8, energy: 4, health: 3 },
    },
    {
        id: "grateful",
        label: "Grateful for what I can do",
        explanation:
            "Cultivates appreciation for current abilities rather than focusing on limitations.",
        delta: { confidence: 7, mood: 5, health: 2 },
    },
    {
        id: "showing-up",
        label: "Proud of showing up today",
        explanation:
            "Builds self-esteem and strengthens commitment to physical activity.",
        delta: { confidence: 8, mood: 6, energy: 2 },
    },
    {
        id: "curious",
        label: "Curious to try new movements",
        explanation:
            "Inspires openness and playfulness, making physical activity more enjoyable.",
        delta: { energy: 6, mood: 5, health: 4 },
    },
    {
        id: "relaxed-stretch",
        label: "Relaxed after gentle stretching",
        explanation:
            "Connects mindful movement to feelings of ease and comfort.",
        delta: { health: 7, mood: 6, energy: 3 },
    },
    {
        id: "self-care",
        label: "Time for self-care feels good",
        explanation:
            "Frames physical activity as an act of self-love rather than a chore.",
        delta: { mood: 7, confidence: 4, health: 3 },
    },
    {
        id: "warmth",
        label: "Warmth spreads through my body",
        explanation:
            "Encourages noticing pleasant bodily sensations without judgment.",
        delta: { health: 5, mood: 5, confidence: 3 },
    },
    {
        id: "breathing",
        label: "My breathing feels calm now",
        explanation:
            "Uses breath awareness as a calming anchor during physical activity.",
        delta: { mood: 8, energy: 2, health: 3 },
    },
    {
        id: "light-free",
        label: "My body feels light and free",
        explanation:
            "Links physical sensations to emotional well-being and a sense of freedom.",
        delta: { health: 6, mood: 6, confidence: 4 },
    },
    {
        id: "energy-flows",
        label: "Energy flows through me now",
        explanation:
            "Recognizes the energizing effects of movement on both body and mind.",
        delta: { energy: 8, mood: 4, health: 3 },
    },
    {
        id: "heart-strength",
        label: "My heart shows my strength",
        explanation:
            "Reframes physical responses as signs of strength and vitality.",
        delta: { confidence: 7, energy: 5, mood: 4 },
    },
];

export default function MindfulnessGame() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(INITIAL_STATS);
    const [reflection, setReflection] = useState("");

    const tasks = useMemo(
        () =>
            PHRASES.map((phrase) => ({
                id: phrase.id,
                label: phrase.label,
                action: () => {
                    setStats((prev) => statsUpdate(prev, phrase.delta));
                    setReflection(phrase.explanation);
                },
            })),
        [],
    );

    const reset = () => {
        setStats(INITIAL_STATS);
        setReflection("");
    };

    return (
        <div className={rcStyles.container}>
            <div className={rcStyles.header}>
                <div className={rcStyles.headerLeft}>
                    <h1 className={rcStyles.mainTitle}>Mindfulness phrases</h1>
                    <p className={rcStyles.headerSubtitle}>
                        Tap any line that fits you right now. Your stats shift a
                        little to reflect the mood of each choice.
                    </p>
                    <div className={rcStyles.scenePill}>Gentle practice</div>
                </div>
                <div className="flex flex-wrap items-center gap-2 justify-end">
                    <button
                        type="button"
                        className={rcStyles.secondaryButton}
                        onClick={() => navigate("/mindfulness-home")}
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        className={rcStyles.resetButton}
                        onClick={reset}
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className={rcStyles.topRow}>
                <StatsPanel stats={stats} />
            </div>

            <div className={rcStyles.section}>
                <h2 className={rcStyles.title}>Choose a phrase</h2>
                <p className={rcStyles.paragraph}>
                    There is no wrong pick—only what feels honest in this
                    moment.
                </p>
                <ActionPanel id="mindfulness-phrases" actions={tasks} />
            </div>

            {reflection !== "" && (
                <div className={rcStyles.section}>
                    <h2 className={rcStyles.subtitle}>Why this helps</h2>
                    <p className={rcStyles.paragraph}>{reflection}</p>
                </div>
            )}
        </div>
    );
}
