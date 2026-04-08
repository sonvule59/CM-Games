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
import { StatDelta, Stats, statsUpdate, StatsViewer } from "./StatsPanel";
import { ActionPanel, ActionSpec } from "./ActionPanel";
import ActivityImage from "./ActivityImage";
import {
    Feedback,
    negativeFeedback,
    positiveFeedback,
    randomElement,
} from "./Feedback";
import { rcStyles } from "../Static/rockClimbingStyles";
import { Container, TopRow } from "./Layout";

// WalkingActivity component.
type WalkingActivityProps = {};

const STARTING_STATS: Stats = Object.freeze({
    energy: 50,
    mood: 50,
    confidence: 50,
    health: 50,
});

const IMAGE_ID_TO_SRC = {
    walkingBikeNeighborhood: imgWalkingBikeNeighborhood,
    walkingBikePark: imgWalkingBikePark,
    walkingBreakNeighborhood: imgWalkingBreakNeighborhood,
    walkingBreakPark: imgWalkingBreakPark,
    walkingChooseLocation: imgWalkingChooseLocation,
    walkingRunNeighborhood: imgWalkingRunNeighborhood,
    walkingRunPark: imgWalkingRunPark,
    walkingStretchNeighborhood: imgWalkingStretchNeighborhood,
    walkingStretchPark: imgWalkingStretchPark,
    walkingWalkNeighborhood: imgWalkingWalkNeighborhood,
    walkingWalkPark: imgWalkingWalkPark,
} satisfies Record<string, string>;

function WalkingActivity({}: WalkingActivityProps) {
    function applyStatDelta(delta: StatDelta) {
        if (newScreenState.screen !== "game") throw new Error();
        const stats = newScreenState.stats;
        newScreenState = {
            ...newScreenState,
            stats: statsUpdate(stats, delta),
        };
    }

    function givePositiveFeedback(message: string) {
        setFeedback(positiveFeedback(message));
    }

    function giveNegativeFeedback(message: string) {
        setFeedback(negativeFeedback(message));
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
              lastAction: "break" | "stretch" | "lightExercise" | undefined;
          };

    const [feedback, setFeedback] = useState<string | undefined>(undefined);
    const [screenState, setScreenState] = useState<ScreenState>({
        screen: "chooseActivity",
    });
    let newScreenState: ScreenState = screenState;

    let tasks: Array<ActionSpec>;
    let tasksPrompt: string;
    let imageId: keyof typeof IMAGE_ID_TO_SRC | undefined = undefined;

    if (screenState.screen === "chooseActivity") {
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
        imageId = undefined;
    } else if (screenState.screen === "chooseLocation") {
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
                        lastAction: undefined,
                    };
                    setScreenState(newScreenState);
                },
            },
        ];
        imageId = "walkingChooseLocation";
    } else if (screenState.screen === "game") {
        let lightExerciseLabel;
        let lightExerciseIcon;
        switch (screenState.activity) {
            case "walk":
                lightExerciseLabel = "Walk";
                lightExerciseIcon = "🚶";
                break;
            case "bike":
                lightExerciseLabel = "Bike";
                lightExerciseIcon = "🚴";
                break;
        }

        switch (screenState.lastAction) {
            case undefined:
                imageId = "walkingChooseLocation";
                break;
            case "break":
                switch (screenState.location) {
                    case "localPark":
                        imageId = "walkingBreakPark";
                        break;
                    case "neighborhood":
                        imageId = "walkingBreakNeighborhood";
                        break;
                }
                break;
            case "lightExercise":
                switch (screenState.location) {
                    case "localPark":
                        switch (screenState.activity) {
                            case "walk":
                                imageId = "walkingWalkPark";
                                break;
                            case "bike":
                                imageId = "walkingBikePark";
                                break;
                        }
                        break;
                    case "neighborhood":
                        switch (screenState.activity) {
                            case "walk":
                                imageId = "walkingWalkNeighborhood";
                                break;
                            case "bike":
                                imageId = "walkingBikeNeighborhood";
                                break;
                        }
                        break;
                }
                break;
            case "stretch":
                switch (screenState.location) {
                    case "localPark":
                        imageId = "walkingStretchPark";
                        break;
                    case "neighborhood":
                        imageId = "walkingStretchNeighborhood";
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
                            mood: -20,
                            health: -10,
                        });
                        giveNegativeFeedback(
                            "You haven't moved in a while, and you're starting to feel bored.",
                        );
                    } else {
                        applyStatDelta({
                            energy: +100,
                            mood: +20,
                            health: -10,
                        });
                        if (screenState.stats.health >= 10) {
                            givePositiveFeedback(
                                "You feel refreshed and ready.",
                            );
                        } else {
                            giveNeutralFeedback(
                                "You feel refreshed, but not quite prepared. Maybe it's time to stretch.",
                            );
                        }
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
                        giveNegativeFeedback(
                            "You feel exhausted. Maybe it's time to take a short break.",
                        );
                    } else if (screenState.stats.health >= 90) {
                        applyStatDelta({
                            energy: -10,
                            health: -100,
                            mood: -50,
                            confidence: -50,
                        });
                        giveNegativeFeedback(
                            "You're starting to feel strained. Maybe it's time to work out.",
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
                            health: -10,
                            confidence: -10,
                            mood: -50,
                        });
                        giveNegativeFeedback(
                            "You feel exhausted. Maybe it's time to take a short break.",
                        );
                    } else if (screenState.stats.health <= 10) {
                        applyStatDelta({
                            energy: -20,
                            health: -10,
                            confidence: -20,
                            mood: -50,
                        });
                        giveNegativeFeedback(
                            "You feel strained. Maybe it's time to stretch.",
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
                            health: -10,
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
            {imageId != undefined && IMAGE_ID_TO_SRC[imageId] != undefined && (
                <ActivityImage id={imageId} src={IMAGE_ID_TO_SRC[imageId]} />
            )}
            <TopRow>
                {screenState.screen === "game" && (
                    <StatsViewer stats={screenState.stats}></StatsViewer>
                )}
            </TopRow>
            <ActionPanel title={tasksPrompt} actions={tasks}></ActionPanel>
            <Feedback feedback={feedback}></Feedback>
        </Container>
    );
}

// Exports.
export default WalkingActivity;
