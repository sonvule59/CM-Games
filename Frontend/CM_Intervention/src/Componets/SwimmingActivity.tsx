import { useState } from "react";
import ActivityImage from "./ActivityImage";

// @ts-ignore
import imgSwimBreak from "../images/swimBreak.png";
// @ts-ignore
import imgSwimLap from "../images/swimLap.png";
// @ts-ignore
import imgSwimTread from "../images/swimTread.png";
import { Stats, statsUpdate, StatsViewer } from "./StatsPanel";
import { ActionPanel, ActionSpec } from "./ActionPanel";

import "../Static/WalkingActivity.css";

const STARTING_STATS: Stats = Object.freeze({
    energy: 50,
    mood: 50,
    confidence: 50,
    mobility: 50,
});

const IMAGE_ID_TO_SRC = {
    swimBreak: imgSwimBreak,
    swimLap: imgSwimLap,
    swimTread: imgSwimTread,
} satisfies Record<string, string>;

type SwimmingActivityProps = {};
export default function SwimmingActivity({}: SwimmingActivityProps) {
    const [feedback, setFeedback] = useState<string | undefined>(
        "Welcome to the pool! Feel free to try some exercises.",
    );

    let actions: Array<ActionSpec>;
    let actionPrompt: string;
    let imageId: keyof typeof IMAGE_ID_TO_SRC | undefined = undefined;

    // Represents the state of the entire component.
    // Goal is to make invalid states unrepresentable using the type system.
    type ScreenState = {
        screen: "game";
        activity: "lapSwim";
        stats: Stats;
        lastActionImage: keyof typeof IMAGE_ID_TO_SRC | undefined;
    };
    const [screenState, setScreenState] = useState<ScreenState>({
        screen: "game",
        activity: "lapSwim",
        stats: STARTING_STATS,
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
                            mobility: +10,
                        }),
                        lastActionImage: "swimLap",
                    });
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
                            mobility: +0,
                        }),
                        lastActionImage: "swimTread",
                    });
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
                            mobility: +50,
                        }),
                        lastActionImage: "swimBreak",
                    });
                },
            },
        ];
        imageId = screenState.lastActionImage;
    } else {
        const _: never = screenState.screen;
        throw new Error();
    }

    return (
        <div className="swimming-game">
            {imageId != undefined && IMAGE_ID_TO_SRC[imageId] != undefined && (
                <ActivityImage id={imageId} src={IMAGE_ID_TO_SRC[imageId]} />
            )}
            {screenState.screen === "game" && (
                <StatsViewer stats={screenState.stats}></StatsViewer>
            )}
            <ActionPanel title={actionPrompt} tasks={actions}></ActionPanel>
            {feedback != undefined && (
                <div className="og-feedback" key={feedback}>
                    {feedback}
                </div>
            )}
        </div>
    );
}
