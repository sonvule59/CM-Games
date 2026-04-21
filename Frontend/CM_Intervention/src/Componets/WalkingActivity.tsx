import { useState } from "react";
import "../Static/WalkingActivity.css";

import imgWalkingBikeNeighborhood from "../images/walkingBikeNeighborhood.png";
import imgWalkingBikePark from "../images/walkingBikePark.png";
import imgWalkingBreakNeighborhood from "../images/walkingBreakNeighborhood.png";
import imgWalkingBreakPark from "../images/walkingBreakPark.png";
import imgWalkingChooseLocation from "../images/walkingChooseLocation.png";
import imgWalkingRunNeighborhood from "../images/walkingRunNeighborhood.png";
import imgWalkingRunPark from "../images/walkingRunPark.png";
import imgWalkingStretchNeighborhood from "../images/walkingStretchNeighborhood.png";
import imgWalkingStretchPark from "../images/walkingStretchPark.png";
import imgWalkingWalkNeighborhood from "../images/walkingWalkNeighborhood.png";
import imgWalkingWalkPark from "../images/walkingWalkPark.png";
import imgCycleOrWalk from "../images/cycleorwalk.png";
import {
    StatDelta,
    StatDeltaViewer,
    Stats,
    statsUpdate,
    StatsViewer,
} from "./StatsPanel";
import { ActionPanel, ActionSpec } from "./ActionPanel";
import ActivityImage from "./ActivityImage";
import {
    Feedback,
    negativeFeedback,
    positiveFeedback,
    randomElement,
} from "./Feedback";
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
    ScenePill,
    Section,
    Title,
    TopRow,
} from "./Layout";
import { href, useNavigate } from "react-router";

// WalkingActivity component.
type WalkingActivityProps = {};

const STARTING_STATS: Stats = Object.freeze({
    energy: 50,
    mood: 50,
    confidence: 50,
    health: 50,
});

// Undefined means image is not available yet and a placeholder will be shown.
const IMAGE_ID_TO_SRC = {
    bikeNeighborhood: imgWalkingBikeNeighborhood,
    bikePark: imgWalkingBikePark,
    breakNeighborhood: imgWalkingBreakNeighborhood,
    breakPark: imgWalkingBreakPark,
    chooseLocation: imgWalkingChooseLocation,
    runNeighborhood: imgWalkingRunNeighborhood,
    runPark: imgWalkingRunPark,
    stretchNeighborhood: imgWalkingStretchNeighborhood,
    stretchPark: imgWalkingStretchPark,
    walkNeighborhood: imgWalkingWalkNeighborhood,
    walkPark: imgWalkingWalkPark,
    chooseWalkingCycling: imgCycleOrWalk,
} satisfies Record<string, string | undefined>;

// TODO: make feedback phrases longer.

function WalkingActivity({}: WalkingActivityProps) {
    const navigate = useNavigate();

    function applyStatDelta(delta: StatDelta) {
        if (newScreenState.screen !== "game") throw new Error();
        const stats = newScreenState.stats;
        newScreenState = {
            ...newScreenState,
            stats: statsUpdate(stats, delta),
            lastStats: stats,
        };
    }

    function givePositiveFeedback(message: string) {
        setFeedback(positiveFeedback(message));
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
              lastStats: Stats | undefined;
              lastAction: "break" | "stretch" | "lightExercise" | undefined;
          };

    const [feedback, setFeedback] = useState<string | undefined>(undefined);
    const [screenState, setScreenState] = useState<ScreenState>({
        screen: "chooseActivity",
    });
    let newScreenState: ScreenState = screenState;

    let tasks: Array<ActionSpec>;
    let tasksPrompt: string;
    let imageId: keyof typeof IMAGE_ID_TO_SRC | undefined;
    let scenePillLabel: React.ReactNode;

    if (screenState.screen === "chooseActivity") {
        scenePillLabel = "Mobility";
        tasksPrompt = "Choose an Activity";
        tasks = [
            {
                id: "chooseWalking",
                label: "Walking",
                icon: "🚶",
                desc: "Take a relaxing walk",
                action() {
                    newScreenState = {
                        screen: "chooseLocation",
                        activity: "walk",
                    };
                    setScreenState(newScreenState);
                },
            },
            {
                id: "chooseBiking",
                label: "Cycling",
                icon: "🚴",
                desc: "Get out your bike and take a stroll",
                action() {
                    newScreenState = {
                        screen: "chooseLocation",
                        activity: "bike",
                    };
                    setScreenState(newScreenState);
                },
            },
        ];
        imageId = "chooseWalkingCycling";
    } else if (screenState.screen === "chooseLocation") {
        scenePillLabel = "Mobility";
        tasksPrompt = "Choose a Location";
        tasks = [
            {
                id: "chooseNeighborhood",
                label: "Neighborhood",
                icon: "🏠",
                desc: "Take a walk or bike in the neighborhood",
                action() {
                    newScreenState = {
                        screen: "game",
                        activity: screenState.activity,
                        location: "neighborhood",
                        stats: STARTING_STATS,
                        lastStats: undefined,
                        lastAction: undefined,
                    };
                    setScreenState(newScreenState);
                },
            },
            {
                id: "chooseLocalPark",
                label: "Local Park",
                icon: "🌳",
                desc: "Take a walk or bike in the local park",
                action() {
                    newScreenState = {
                        screen: "game",
                        activity: screenState.activity,
                        location: "localPark",
                        stats: STARTING_STATS,
                        lastStats: undefined,
                        lastAction: undefined,
                    };
                    setScreenState(newScreenState);
                },
            },
        ];
        imageId = "chooseLocation";
    } else if (screenState.screen === "game") {
        let lightExerciseLabel;
        let lightExerciseIcon;
        switch (screenState.activity) {
            case "walk":
                scenePillLabel = "Walking";
                lightExerciseLabel = "Walk";
                lightExerciseIcon = "🚶";
                break;
            case "bike":
                scenePillLabel = "Biking";
                lightExerciseLabel = "Bike";
                lightExerciseIcon = "🚴";
                break;
        }

        switch (screenState.lastAction) {
            case undefined:
                imageId = "chooseLocation";
                break;
            case "break":
                switch (screenState.location) {
                    case "localPark":
                        imageId = "breakPark";
                        break;
                    case "neighborhood":
                        imageId = "breakNeighborhood";
                        break;
                }
                break;
            case "lightExercise":
                switch (screenState.location) {
                    case "localPark":
                        switch (screenState.activity) {
                            case "walk":
                                imageId = "walkPark";
                                break;
                            case "bike":
                                imageId = "bikePark";
                                break;
                        }
                        break;
                    case "neighborhood":
                        switch (screenState.activity) {
                            case "walk":
                                imageId = "walkNeighborhood";
                                break;
                            case "bike":
                                imageId = "bikeNeighborhood";
                                break;
                        }
                        break;
                }
                break;
            case "stretch":
                switch (screenState.location) {
                    case "localPark":
                        imageId = "stretchPark";
                        break;
                    case "neighborhood":
                        imageId = "stretchNeighborhood";
                        break;
                }
                break;
        }
        console.log(
            screenState.lastAction,
            screenState.location,
            screenState.activity,
            imageId,
        );

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
                        });
                        giveNeutralFeedback(
                            "You feel refreshed, but maybe it's time to start walking.",
                        );
                    } else {
                        applyStatDelta({
                            energy: +100,
                            mood: +20,
                        });
                        givePositiveFeedback("You feel refreshed and ready.");
                    }
                    newScreenState = {
                        ...newScreenState,
                        lastAction: "break",
                    } as any;
                    if (screenState !== newScreenState)
                        setScreenState(newScreenState);
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
                            health: +20,
                        });
                        giveNeutralFeedback(
                            "You've been doing activity for a while. Maybe it's time to take a short break.",
                        );
                    } else {
                        applyStatDelta({
                            energy: -10,
                            health: +50,
                            mood: +10,
                        });
                        givePositiveFeedback("You feel ready to work out.");
                    }
                    newScreenState = {
                        ...newScreenState,
                        lastAction: "stretch",
                    } as any;
                    if (screenState !== newScreenState)
                        setScreenState(newScreenState);
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
                            health: +10,
                            confidence: +10,
                        });
                        giveNeutralFeedback(
                            "You've been doing activity for a while. Maybe it's time to take a short break.",
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
                            health: +10,
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
                    newScreenState = {
                        ...newScreenState,
                        lastAction: "lightExercise",
                    } as any;
                    if (screenState !== newScreenState)
                        setScreenState(newScreenState);
                },
            },
        ];
    } else {
        const _: never = screenState;
        throw new Error();
    }

    return (
        <Container>
            <Header>
                <HeaderLeft>
                    <MainTitle>Walking and cycling</MainTitle>
                    <HeaderSubtitle>
                        Take a leisurely stroll and relax.
                    </HeaderSubtitle>
                    {scenePillLabel != undefined && (
                        <ScenePill>{scenePillLabel}</ScenePill>
                    )}
                </HeaderLeft>
                <HeaderRight>
                    <BackButton onClick={() => navigate(href("/leisure"))} />
                </HeaderRight>
            </Header>
            {screenState.screen === "game" && (
                <TopRow>
                    <StatsViewer stats={screenState.stats}></StatsViewer>
                </TopRow>
            )}
            {imageId != undefined &&
                (IMAGE_ID_TO_SRC[imageId] != undefined ? (
                    <ActivityImage
                        key={imageId}
                        src={IMAGE_ID_TO_SRC[imageId]!}
                    />
                ) : (
                    <ActivityImage key={imageId}>
                        Placeholder: {imageId}
                    </ActivityImage>
                ))}
            {feedback === undefined ? (
                <ActionPanel title={tasksPrompt} actions={tasks}></ActionPanel>
            ) : (
                <Section>
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
                </Section>
            )}
        </Container>
    );
}

// Exports.
export default WalkingActivity;
