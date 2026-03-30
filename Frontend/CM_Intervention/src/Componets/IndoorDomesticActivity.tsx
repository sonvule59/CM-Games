import { useState } from "react";
import { ActionPanel, ActionSpec } from "./ActionPanel";
import { Feedback, negativeFeedback, positiveFeedback } from "./Feedback";
import ActivityImage from "./ActivityImage";
import { Stats, StatsViewer } from "./StatsPanel";

type IndoorDomesticActivityProps = {};

const IMAGE_ID_TO_SRC = {} satisfies Record<string, string | undefined>;

const STARTING_STATS: Stats = Object.freeze({
    energy: 50,
    mood: 50,
    confidence: 50,
    mobility: 50,
});

function IndoorDomesticActivity({}: IndoorDomesticActivityProps) {
    function givePositiveFeedback(message: string) {
        setFeedback(positiveFeedback(message));
    }

    function giveNegativeFeedback(message: string) {
        setFeedback(negativeFeedback(message));
    }

    function giveNeutralFeedback(message: string) {
        setFeedback(message);
    }

    const [feedback, setFeedback] = useState<string | undefined>(
        "You're back home, but your house is looking pretty messy. It's probably time to do some chores.",
    );

    let actions: Array<ActionSpec>;
    let actionPrompt: string;
    let imageId: keyof typeof IMAGE_ID_TO_SRC | undefined = undefined;

    const [stats, setStats] = useState<Stats>(STARTING_STATS);
    const [didCleaning, setDidCleaning] = useState<boolean>(false);
    const [didDishes, setDidDishes] = useState<boolean>(false);
    const [didLaundry, setDidLaundry] = useState<boolean>(false);
    const [didCooking, setDidCooking] = useState<boolean>(false);
    const [didDinner, setDidDinner] = useState<boolean>(false);

    type ActivityState = Readonly<
        | { activity: "overview" }
        | { activity: "cleaning" }
        | { activity: "dishes" }
        | { activity: "laundry" }
        | { activity: "cooking" }
        | { activity: "dinner" }
    >;
    const [activityState, setActivityState] = useState<ActivityState>({
        activity: "overview",
    });

    switch (activityState.activity) {
        case "overview":
            actionPrompt = "Choose an activity";
            actions = [
                {
                    id: "startCleaning",
                    label: "Cleaning",
                    icon: "🧹",
                    desc: "Clean the house",
                    action() {
                        setActivityState({ activity: "cleaning" });
                    },
                },
                {
                    id: "startDishes",
                    label: "Dishes",
                    icon: "🧽",
                    desc: "Clean the dishes",
                    action() {
                        setActivityState({ activity: "dishes" });
                    },
                },
                {
                    id: "startLaundry",
                    label: "Laundry",
                    icon: "🧺",
                    desc: "Do the laundry",
                    action() {
                        setActivityState({ activity: "laundry" });
                    },
                },
                {
                    id: "startCooking",
                    label: "Cook",
                    icon: "🍲",
                    desc: "Cook some food",
                    action() {
                        setActivityState({ activity: "cooking" });
                    },
                },
                {
                    id: "startDinner",
                    label: "Eat",
                    icon: "🍽️",
                    desc: "Have dinner",
                    action() {
                        setActivityState({ activity: "dinner" });
                    },
                },
            ];
            break;
        default:
            throw new Error("unimplemented");
            activityState satisfies never;
    }

    return (
        <div className="indoor-domestic-game">
            {imageId != undefined && IMAGE_ID_TO_SRC[imageId] != undefined && (
                <ActivityImage id={imageId} src={IMAGE_ID_TO_SRC[imageId]} />
            )}
            <StatsViewer stats={stats}></StatsViewer>
            <ActionPanel title={actionPrompt} tasks={actions}></ActionPanel>
            <Feedback feedback={feedback}></Feedback>
        </div>
    );
}

export default IndoorDomesticActivity;
