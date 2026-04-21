import React, { useMemo, useState } from "react";
import { href, useNavigate } from "react-router";
import { ActionPanel } from "./ActionPanel.tsx";
import {
    statsUpdate,
    StatsPanel,
    StatDelta,
    StatDeltaViewer,
} from "./StatsPanel.tsx";
import {
    BackButton,
    Container,
    Header,
    HeaderLeft,
    HeaderRight,
    HeaderSubtitle,
    MainTitle,
    Paragraph,
    PrimaryButton,
    ResetButton,
    ScenePill,
    Section,
    Title,
    TopRow,
} from "./Layout.tsx";
import ActivityImage from "./ActivityImage.tsx";

// Mindfulness phrase images (src/images — filenames match each prompt theme)
// @ts-ignore
import imgBodyKindness from "../images/bodyKindness.png";
// @ts-ignore
import imgBreathingCalm from "../images/breathingCalm.png";
// @ts-ignore
import imgCalmerMoving from "../images/calmerMoving.png";
// @ts-ignore
import imgCuriousToTryNew from "../images/curiousToTryNew.png";
// @ts-ignore
import imgEnergyFlowsThrough from "../images/energyFlowsThrough.png";
// @ts-ignore
import imgFocusOnFeel from "../images/focusOnFeel.png";
// @ts-ignore
import imgGratefulWhatCanDo from "../images/gratefulWhatCanDo.png";
// @ts-ignore
import imgHeartShowsStrength from "../images/heartShowsStrength.png";
// @ts-ignore
import imgLightAndFree from "../images/lightandFree.png";
// @ts-ignore
import imgOkayToGoSlow from "../images/okayToGoSlow.png";
// @ts-ignore
import imgProudShowingUp from "../images/proudShowingUp.png";
// @ts-ignore
import imgRelaxedAfterStretch from "../images/relaxedAfterStretch.png";
// @ts-ignore
import imgSelfCareGood from "../images/selfCareGood.png";
// @ts-ignore
import imgSmallSteps from "../images/smallSteps.png";
// @ts-ignore
import imgWarmthThroughBody from "../images/warmthThroughBody.png";

const INITIAL_STATS = {
    confidence: 50,
    mood: 50,
    health: 50,
    energy: 50,
};

type PhraseSpec = {
    id: string;
    label: React.ReactNode;
    explanation: React.ReactNode;
    delta: StatDelta;
    imageSrc: string;
};

/** Short phrase (button) and fuller meaning (shown after you tap). */
const PHRASES: PhraseSpec[] = [
    {
        id: "focus-feel",
        label: "I can focus on how I feel",
        explanation:
            "Shifts attention from external appearance to internal sensations, encouraging mindfulness and self-acceptance.",
        delta: { mood: 6, health: 4, confidence: 4, energy: 2 },
        imageSrc: imgFocusOnFeel,
    },
    {
        id: "small-steps",
        label: "Every small step counts",
        explanation:
            "Reinforces the idea that even small actions are valuable and contribute to progress.",
        delta: { confidence: 6, mood: 4, energy: 3 },
        imageSrc: imgSmallSteps,
    },
    {
        id: "go-slow",
        label: "It's okay to go slow",
        explanation:
            "Promotes self-compassion and reduces the pressure to perform at a certain level.",
        delta: { mood: 7, health: 3, energy: 4 },
        imageSrc: imgOkayToGoSlow,
    },
    {
        id: "body-kindness",
        label: "My body deserves kindness",
        explanation:
            "Encourages a nurturing mindset that supports engaging in physical activity.",
        delta: { health: 6, mood: 5, confidence: 5 },
        imageSrc: imgBodyKindness,
    },
    {
        id: "calmer-moving",
        label: "I feel calmer after moving",
        explanation:
            "Highlights the emotional benefits of movement, reinforcing a positive association.",
        delta: { mood: 8, energy: 4, health: 3 },
        imageSrc: imgCalmerMoving,
    },
    {
        id: "grateful",
        label: "Grateful for what I can do",
        explanation:
            "Cultivates appreciation for current abilities rather than focusing on limitations.",
        delta: { confidence: 7, mood: 5, health: 2 },
        imageSrc: imgGratefulWhatCanDo,
    },
    {
        id: "showing-up",
        label: "Proud of showing up today",
        explanation:
            "Builds self-esteem and strengthens commitment to physical activity.",
        delta: { confidence: 8, mood: 6, energy: 2 },
        imageSrc: imgProudShowingUp,
    },
    {
        id: "curious",
        label: "Curious to try new movements",
        explanation:
            "Inspires openness and playfulness, making physical activity more enjoyable.",
        delta: { energy: 6, mood: 5, health: 4 },
        imageSrc: imgCuriousToTryNew,
    },
    {
        id: "relaxed-stretch",
        label: "Relaxed after gentle stretching",
        explanation:
            "Connects mindful movement to feelings of ease and comfort.",
        delta: { health: 7, mood: 6, energy: 3 },
        imageSrc: imgRelaxedAfterStretch,
    },
    {
        id: "self-care",
        label: "Time for self-care feels good",
        explanation:
            "Frames physical activity as an act of self-love rather than a chore.",
        delta: { mood: 7, confidence: 4, health: 3 },
        imageSrc: imgSelfCareGood,
    },
    {
        id: "warmth",
        label: "Warmth spreads through my body",
        explanation:
            "Encourages noticing pleasant bodily sensations without judgment.",
        delta: { health: 5, mood: 5, confidence: 3 },
        imageSrc: imgWarmthThroughBody,
    },
    {
        id: "breathing",
        label: "My breathing feels calm now",
        explanation:
            "Uses breath awareness as a calming anchor during physical activity.",
        delta: { mood: 8, energy: 2, health: 3 },
        imageSrc: imgBreathingCalm,
    },
    {
        id: "light-free",
        label: "My body feels light and free",
        explanation:
            "Links physical sensations to emotional well-being and a sense of freedom.",
        delta: { health: 6, mood: 6, confidence: 4 },
        imageSrc: imgLightAndFree,
    },
    {
        id: "energy-flows",
        label: "Energy flows through me now",
        explanation:
            "Recognizes the energizing effects of movement on both body and mind.",
        delta: { energy: 8, mood: 4, health: 3 },
        imageSrc: imgEnergyFlowsThrough,
    },
    {
        id: "heart-strength",
        label: "My heart shows my strength",
        explanation:
            "Reframes physical responses as signs of strength and vitality.",
        delta: { confidence: 7, energy: 5, mood: 4 },
        imageSrc: imgHeartShowsStrength,
    },
];

export default function MindfulnessGame() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(INITIAL_STATS);
    const [currentPhrase, setCurrentPhrase] = useState<PhraseSpec | undefined>(
        undefined,
    );

    const tasks = useMemo(
        () =>
            PHRASES.map((phrase) => ({
                id: phrase.id,
                label: phrase.label,
                action: () => {
                    setStats((prev) => statsUpdate(prev, phrase.delta));
                    setCurrentPhrase(phrase);
                },
            })),
        [],
    );

    const reset = () => {
        setStats(INITIAL_STATS);
        setCurrentPhrase(undefined);
    };

    return (
        <Container>
            <Header>
                <HeaderLeft>
                    <MainTitle>Mindfulness phrases</MainTitle>
                    <HeaderSubtitle>
                        Tap any line that fits you right now. Your stats shift a
                        little to reflect the mood of each choice.
                    </HeaderSubtitle>
                    <ScenePill>Gentle practice</ScenePill>
                </HeaderLeft>
                <HeaderRight>
                    <BackButton onClick={() => navigate(href("/mindfulness-home"))} />
                    <ResetButton onClick={reset} />
                </HeaderRight>
            </Header>

            <TopRow>
                <StatsPanel stats={stats} />
            </TopRow>

            {currentPhrase == undefined ? (
                <Section>
                    <Title>Choose a phrase</Title>
                    <Paragraph>
                        There is no wrong pick—only what feels honest in this
                        moment.
                    </Paragraph>
                    <ActionPanel id="mindfulness-phrases" actions={tasks} />
                </Section>
            ) : (
                <>
                    <ActivityImage
                        src={currentPhrase.imageSrc}
                        subtitle={currentPhrase.label}
                    />
                    <Section>
                        <Title>Why this helps</Title>
                        <Paragraph>{currentPhrase.explanation}</Paragraph>
                        <StatDeltaViewer delta={currentPhrase.delta} />
                        <PrimaryButton
                            onClick={() => setCurrentPhrase(undefined)}
                        >
                            Continue
                        </PrimaryButton>
                    </Section>
                </>
            )}
        </Container>
    );
}
