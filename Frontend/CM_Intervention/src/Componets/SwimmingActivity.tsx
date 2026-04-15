import { useState } from "react";
import ActivityImage from "./ActivityImage";

// @ts-ignore
import imgSwimBreak from "../images/swimBreak.png";
// @ts-ignore
import imgSwimLap from "../images/swimLap.png";
// @ts-ignore
import imgSwimTread from "../images/swimTread.png";
import { StatDeltaViewer, Stats, statsUpdate, StatsViewer } from "./StatsPanel";
import { ActionPanel, ActionSpec } from "./ActionPanel";

import "../Static/WalkingActivity.css";
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
} from "./Layout";
import { negativeFeedback, positiveFeedback } from "./Feedback";
import { useNavigate } from "react-router";

const STARTING_STATS: Stats = Object.freeze({
    energy: 50,
    mood: 50,
    confidence: 50,
    health: 50,
});

// Undefined means image is unavailable and a placeholder will be shown.
const IMAGE_ID_TO_SRC = {
    break: imgSwimBreak,
    lap: imgSwimLap,
    tread: imgSwimTread,
    visitingPool: undefined,
    poolWalking: undefined,
    poolJogging: undefined,
    poolCycling: undefined,
} satisfies Record<string, string | undefined>;

type SwimmingActivityProps = {};
export default function SwimmingActivity({}: SwimmingActivityProps) {
    const navigate = useNavigate();
    
    const [feedback, setFeedback] = useState<string | undefined>(undefined);

    function givePositiveFeedback(message: string) {
        setFeedback(positiveFeedback(message));
    }

    function giveNegativeFeedback(message: string) {
        setFeedback(negativeFeedback(message));
    }

    function giveNeutralFeedback(message: string) {
        setFeedback(message);
    }

    let actions: Array<ActionSpec>;
    let actionPrompt: string;
    let imageId: keyof typeof IMAGE_ID_TO_SRC | undefined;

    // Represents the state of the entire component.
    // Goal is to make invalid states unrepresentable using the type system.
    type ScreenState = {
        screen: "game";
        activity: "lapSwim";
        stats: Stats;
        lastStats: Stats | undefined;
        lastActionImage: keyof typeof IMAGE_ID_TO_SRC | undefined;
    };
    const [screenState, setScreenState] = useState<ScreenState>({
        screen: "game",
        activity: "lapSwim",
        stats: STARTING_STATS,
        lastStats: undefined,
        lastActionImage: undefined,
    });

    if (screenState.screen === "game") {
        actionPrompt = "Choose an Action";
        actions = [
            {
                id: "lap",
                label: "Lap",
                icon: "🏊",
                desc: "Swim one lap",
                action() {
                    setScreenState({
                        ...screenState,
                        stats: statsUpdate(screenState.stats, {
                            energy: -10,
                            mood: +10,
                            confidence: +10,
                            health: +10,
                        }),
                        lastStats: screenState.stats,
                        lastActionImage: "lap",
                    });
                    givePositiveFeedback(
                        "After swimming a lap, you feel better and more confident.",
                    );
                },
            },
            {
                id: "tread",
                label: "Tread water",
                icon: "🚴",
                desc: "Use your arms and legs to float",
                action() {
                    setScreenState({
                        ...screenState,
                        stats: statsUpdate(screenState.stats, {
                            energy: -5,
                            mood: +10,
                            confidence: +10,
                            health: +10,
                        }),
                        lastStats: screenState.stats,
                        lastActionImage: "tread",
                    });
                    givePositiveFeedback("You feel more confident.");
                },
            },
            {
                id: "poolWalking",
                label: "Pool walk",
                icon: "🚶",
                desc: "Walk in the shallow end of the pool.",
                action() {
                    setScreenState({
                        ...screenState,
                        stats: statsUpdate(screenState.stats, {
                            energy: -5,
                            mood: +10,
                            confidence: +10,
                            health: +10,
                        }),
                        lastStats: screenState.stats,
                        lastActionImage: "poolWalking",
                    });
                    givePositiveFeedback(
                        "The resistance in the water helps you strengthen your muscles and burn calories.",
                    );
                },
            },
            {
                id: "poolJogging",
                label: "Pool jog",
                icon: "🏃",
                desc: "Jog in the shallow end of the pool.",
                action() {
                    setScreenState({
                        ...screenState,
                        stats: statsUpdate(screenState.stats, {
                            energy: -10,
                            mood: +10,
                            confidence: +15,
                            health: +20,
                        }),
                        lastStats: screenState.stats,
                        lastActionImage: "poolJogging",
                    });
                    givePositiveFeedback(
                        "The resistance in the water helps you strengthen your muscles and burn calories.",
                    );
                },
            },
            {
                id: "poolCycling",
                label: "Pool cycle",
                icon: "🚴",
                desc: "Take part in a pool cycling session, where you use a cycling machine in the shallow end of the pool",
                action() {
                    setScreenState({
                        ...screenState,
                        stats: statsUpdate(screenState.stats, {
                            energy: -5,
                            mood: +10,
                            confidence: +10,
                            health: +15,
                        }),
                        lastStats: screenState.stats,
                        lastActionImage: "poolCycling",
                    });
                    givePositiveFeedback(
                        "As you cycle with others, you build confidence. The resistance in the water helps you strengthen your muscles and burn calories.",
                    );
                },
            },
            {
                id: "break",
                label: "Take break",
                icon: "⏲️",
                desc: "Take a short break",
                action() {
                    setScreenState({
                        ...screenState,
                        stats: statsUpdate(screenState.stats, {
                            energy: +50,
                            mood: +10,
                            confidence: +0,
                            health: +0,
                        }),
                        lastStats: screenState.stats,
                        lastActionImage: "break",
                    });
                    givePositiveFeedback(
                        "After resting for a bit, you feel relaxed, refreshed, and ready for more activity.",
                    );
                },
            },
        ];
        imageId =
            feedback != undefined
                ? (screenState.lastActionImage ?? "visitingPool")
                : "visitingPool";
    } else {
        const _: never = screenState.screen;
        throw new Error();
    }

    const firstTime =
        screenState.screen === "game" && screenState.lastStats === undefined;

    return (
        <Container>
            <Header>
                <HeaderLeft>
                    <MainTitle>Swimming</MainTitle>
                    <HeaderSubtitle>
                        A day at the pool to do some activities and have fun.
                    </HeaderSubtitle>
                    <ScenePill>Water activities</ScenePill>
                </HeaderLeft>
                <HeaderRight>
                    <BackButton onClick={() => navigate("/leisure")} />
                </HeaderRight>
            </Header>
            <TopRow>
                {screenState.screen === "game" && (
                    <StatsViewer stats={screenState.stats}></StatsViewer>
                )}
            </TopRow>
            {imageId != undefined &&
                (IMAGE_ID_TO_SRC[imageId] != undefined ? (
                    <ActivityImage src={IMAGE_ID_TO_SRC[imageId]!} />
                ) : (
                    <ActivityImage>Placeholder: {imageId}</ActivityImage>
                ))}
            <Section>
                {firstTime && (
                    <>
                        <Title>Welcome to the pool!</Title>
                        <Paragraph>
                            Feel free to try some activities while you're here.
                        </Paragraph>
                    </>
                )}
                {feedback === undefined ? (
                    <ActionPanel
                        title={firstTime ? undefined : actionPrompt}
                        actions={actions}
                    />
                ) : (
                    <>
                        <Title>How it plays out</Title>
                        <Paragraph>{feedback}</Paragraph>
                        {screenState.screen === "game" &&
                            screenState.lastStats !== undefined && (
                                <StatDeltaViewer
                                    newStats={screenState.stats}
                                    oldStats={screenState.lastStats}
                                />
                            )}
                        <PrimaryButton
                            onClick={() => {
                                setFeedback(undefined);
                            }}
                        >
                            Continue
                        </PrimaryButton>
                    </>
                )}
            </Section>
        </Container>
    );
}
