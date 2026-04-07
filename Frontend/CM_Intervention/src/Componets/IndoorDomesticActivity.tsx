import { useState } from "react";
import { ActionPanel, ActionSpec } from "./ActionPanel";
import { Feedback, negativeFeedback, positiveFeedback } from "./Feedback";
import ActivityImage from "./ActivityImage";
import { Stats, statsUpdate, StatsViewer } from "./StatsPanel";

// Source: https://www.freepik.com/free-vector/empty-room-with-light-yellow-wall-parquet-floor_21196882.htm
// @ts-ignore
import imgIndoorDomesticBgs from "../images/indoorDomesticBg.jpg";

// Source: https://freesvg.org/basket-with-dirty-laundry-vector-clip-art
// @ts-ignore
import imgFullBasket from "../images/foldedBasket.svg";

// Source: https://freesvg.org/plastic-laundry-basket-vector-drawing
// @ts-ignore
import imgEmptyBasket from "../images/emptyBasket.svg";

// Source: https://freesvg.org/spilled-orange-drink
// @ts-ignore
import imgSpilledOrangeDrink from "../images/spilledOrangeDrink.svg";

// Source: https://toppng.com/show_download/111868/dust-cloud-png
// @ts-ignore
import imgDustCloud from "../images/dustCloud.png";

// Source: https://www.vecteezy.com/vector-art/1314090-cartoon-style-dirty-and-clean-dishes-set
// @ts-ignore
import imgDishes from "../images/dishes.png";

// Source: https://commons.wikimedia.org/wiki/File:Dinner_table_side_pine_wood_large_table_front.png
// @ts-ignore
import imgTable from "../images/table.png";

type IndoorDomesticActivityProps = {};

const IMAGE_ID_TO_SRC = {} satisfies Record<string, string | undefined>;

const STARTING_STATS: Stats = Object.freeze({
    energy: 50,
    mood: 50,
    confidence: 50,
    mobility: 50,
});

function HouseImage({
    didCleaning,
    didDishes,
    didLaundry,
    didCooking,
    didDinner,
}: {
    didCleaning: boolean;
    didDishes: boolean;
    didLaundry: boolean;
    didCooking: boolean;
    didDinner: boolean;
}) {
    return (
        <svg viewBox="0 0 720 400" xmlns="http://www.w3.org/2000/svg">
            <image
                x={0}
                y={0}
                width={720}
                height={400}
                href={imgIndoorDomesticBgs}
            ></image>
            <image
                x={20}
                y={220}
                width={150}
                height={150}
                href={didLaundry ? imgEmptyBasket : imgFullBasket}
            ></image>
            <g>
                <image x={400} y={200} width={300} href={imgTable}></image>
                <svg
                    x={450}
                    y={100}
                    width={100}
                    height={200}
                    viewBox={didDishes ? "3500 0 3500 5000" : "0 0 3500 5000"}
                >
                    <image
                        x={0}
                        y={0}
                        width={7000}
                        height={5000}
                        href={imgDishes}
                    ></image>
                </svg>
            </g>
            <g display={didCleaning ? "none" : "inline"}>
                <image
                    x={600}
                    y={300}
                    width={50}
                    height={50}
                    href={imgSpilledOrangeDrink}
                ></image>
                <image
                    x={0}
                    y={50}
                    width={800}
                    href={imgDustCloud}
                    opacity={0.8}
                ></image>
            </g>
        </svg>
    );
}

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
    let imageId: "house" | keyof typeof IMAGE_ID_TO_SRC | undefined = undefined;

    const [stats, setStats] = useState<Stats>(STARTING_STATS);
    const [didCleaning, setDidCleaning] = useState<boolean>(false);
    const [didDishes, setDidDishes] = useState<boolean>(false);
    const [didLaundry, setDidLaundry] = useState<boolean>(false);
    const [didCooking, setDidCooking] = useState<boolean>(false);
    const [didDinner, setDidDinner] = useState<boolean>(false);

    type ActivityState = Readonly<
        | { activity: "overview" }
        | {
              activity: "cleaning";
              didVacuuming: boolean;
              didSweeping: boolean;
              didMopping: boolean;
              didDusting: boolean;
          }
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
            imageId = "house";
            actionPrompt = "Choose an activity";
            actions = [
                {
                    id: "startCleaning",
                    label: "Cleaning",
                    icon: "🧹",
                    desc: "Clean the house",
                    action() {
                        setActivityState({
                            activity: "cleaning",
                            didVacuuming: false,
                            didSweeping: false,
                            didMopping: false,
                            didDusting: false,
                        });
                    },
                },
                {
                    id: "startDishes",
                    label: "Dishes",
                    icon: "🧽",
                    desc: "Clean the dishes",
                    action() {
                        setDidDishes(true);
                        // setActivityState({ activity: "dishes" });
                    },
                },
                {
                    id: "startLaundry",
                    label: "Laundry",
                    icon: "🧺",
                    desc: "Do the laundry",
                    action() {
                        setDidLaundry(true);
                        // setActivityState({ activity: "laundry" });
                    },
                },
                {
                    id: "startCooking",
                    label: "Cook",
                    icon: "🍲",
                    desc: "Cook some food",
                    action() {
                        setDidCooking(true);
                        // setActivityState({ activity: "cooking" });
                    },
                },
                {
                    id: "startDinner",
                    label: "Eat",
                    icon: "🍽️",
                    desc: "Have dinner",
                    action() {
                        setDidDinner(true);
                        setStats(statsUpdate(stats, { energy: +100 }));
                        // setActivityState({ activity: "dinner" });
                    },
                },
            ];
            break;
        case "cleaning":
            actionPrompt = "Choose an activity";
            actions = [];
            if (!activityState.didVacuuming)
                actions.push({
                    id: "vacuum",
                    label: "Vacuum",
                    icon: "🌫️",
                    desc: "Vacuum the house",
                    action() {
                        setStats(statsUpdate(stats, { energy: -10 }));
                        if (
                            activityState.didSweeping &&
                            activityState.didMopping &&
                            activityState.didDusting
                        ) {
                            setDidCleaning(true);
                            setActivityState({
                                activity: "overview",
                            });
                        } else {
                            setActivityState({
                                ...activityState,
                                didVacuuming: true,
                            });
                        }
                    },
                });
            if (!activityState.didSweeping)
                actions.push({
                    id: "sweep",
                    label: "Sweep",
                    icon: "🧹",
                    desc: "Sweep the house",
                    action() {
                        setStats(statsUpdate(stats, { energy: -10 }));
                        if (
                            activityState.didVacuuming &&
                            activityState.didMopping &&
                            activityState.didDusting
                        ) {
                            setDidCleaning(true);
                            setActivityState({
                                activity: "overview",
                            });
                        } else {
                            setActivityState({
                                ...activityState,
                                didSweeping: true,
                            });
                        }
                    },
                });
            if (!activityState.didMopping)
                actions.push({
                    id: "mop",
                    label: "Mop",
                    icon: "🪣",
                    desc: "Mop the house",
                    action() {
                        setStats(statsUpdate(stats, { energy: -10 }));
                        if (
                            activityState.didVacuuming &&
                            activityState.didSweeping &&
                            activityState.didDusting
                        ) {
                            setDidCleaning(true);
                            setActivityState({
                                activity: "overview",
                            });
                        } else {
                            setActivityState({
                                ...activityState,
                                didMopping: true,
                            });
                        }
                    },
                });
            if (!activityState.didDusting)
                actions.push({
                    id: "dust",
                    label: "Dust",
                    icon: "🧽",
                    desc: "Dust the house",
                    action() {
                        setStats(statsUpdate(stats, { energy: -10 }));
                        if (
                            activityState.didVacuuming &&
                            activityState.didSweeping &&
                            activityState.didMopping
                        ) {
                            setDidCleaning(true);
                            setActivityState({
                                activity: "overview",
                            });
                        } else {
                            setActivityState({
                                ...activityState,
                                didDusting: true,
                            });
                        }
                    },
                });
            break;
        default:
            throw new Error("unimplemented");
            activityState satisfies never;
    }

    return (
        <div className="indoor-domestic-game">
            {imageId == "house" ? (
                <ActivityImage key="house-image">
                    <HouseImage
                        didCleaning={didCleaning}
                        didDishes={didDishes}
                        didLaundry={didLaundry}
                        didCooking={didCooking}
                        didDinner={didDinner}
                    ></HouseImage>
                </ActivityImage>
            ) : (
                imageId != undefined &&
                IMAGE_ID_TO_SRC[imageId] != undefined && (
                    <ActivityImage
                        key={imageId}
                        src={IMAGE_ID_TO_SRC[imageId]}
                    />
                )
            )}
            <StatsViewer stats={stats}></StatsViewer>
            <ActionPanel title={actionPrompt} actions={actions}></ActionPanel>
            <Feedback feedback={feedback}></Feedback>
        </div>
    );
}

export default IndoorDomesticActivity;
