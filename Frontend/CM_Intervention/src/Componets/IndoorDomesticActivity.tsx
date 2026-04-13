import { useState } from "react";
import { ActionPanel, ActionSpec } from "./ActionPanel";
import { Feedback, negativeFeedback, positiveFeedback } from "./Feedback";
import ActivityImage from "./ActivityImage";
import { StatDeltaViewer, Stats, statsUpdate, StatsViewer } from "./StatsPanel";

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
import { Container, Paragraph, PrimaryButton, Section, Title } from "./Layout";

type IndoorDomesticActivityProps = {};

const IMAGE_ID_TO_SRC = {} satisfies Record<string, string | undefined>;

const STARTING_STATS: Stats = Object.freeze({
    energy: 50,
    mood: 50,
    confidence: 50,
    health: 50,
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
    type ImageID = "house" | keyof typeof IMAGE_ID_TO_SRC | undefined;

    let actions: Array<ActionSpec>;
    let actionPrompt: string;
    let imageId: ImageID = undefined;
    let message: React.ReactNode = undefined;

    const [stats, _setStats] = useState<Stats>(STARTING_STATS);
    const [oldStats, _setOldStats] = useState<Stats | undefined>(undefined);
    const [didCleaning, setDidCleaning] = useState<boolean>(false);
    const [didDishes, setDidDishes] = useState<boolean>(false);
    const [didLaundry, setDidLaundry] = useState<boolean>(false);
    const [didCooking, setDidCooking] = useState<boolean>(false);
    const [didDinner, setDidDinner] = useState<boolean>(false);

    function setStats(newStats: Stats) {
        _setOldStats(stats);
        _setStats(newStats);
    }

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

    type FeedbackState = Readonly<{
        message: React.ReactNode;
        imageId?: ImageID;
    }>;
    const [feedback, setFeedback] = useState<FeedbackState | undefined>(
        undefined,
    );

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
            {
                function setActivityStateForCleaning(
                    newActivityState: ActivityState & { activity: "cleaning" },
                    feedbackMessage: React.ReactNode,
                ) {
                    const numActivitiesCompleted: 0 | 1 | 2 | 3 | 4 =
                        ((newActivityState.didVacuuming ? 1 : 0) +
                            (newActivityState.didSweeping ? 1 : 0) +
                            (newActivityState.didMopping ? 1 : 0) +
                            (newActivityState.didDusting ? 1 : 0)) as any;
                    const allActivitiesCompleted = numActivitiesCompleted === 4;
                    if (allActivitiesCompleted) {
                        setActivityState({
                            activity: "overview",
                        });
                    } else {
                        setActivityState(newActivityState);
                    }
                    let genericFeedbackMessage: React.ReactNode;
                    switch (numActivitiesCompleted) {
                        case 0:
                            genericFeedbackMessage = <></>;
                            break;
                        case 1:
                            genericFeedbackMessage = (
                                <>
                                    It took a while, but it was totally worth
                                    it. You feel ready to continue cleaning.
                                </>
                            );
                            break;
                        case 2:
                            genericFeedbackMessage = (
                                <>
                                    You look around your home, and marvel at how
                                    clean it looks. You feel confident and proud
                                    of yourself.
                                </>
                            );
                            break;
                        case 3:
                            genericFeedbackMessage = (
                                <>
                                    You're almost done cleaning your home, and
                                    you can't wait to finish.
                                </>
                            );
                            break;
                        case 4:
                            genericFeedbackMessage = (
                                <>
                                    Phew! You're finally done cleaning your
                                    home. You feel accomplished.
                                </>
                            );
                            break;
                        default:
                            numActivitiesCompleted satisfies never;
                            throw new Error();
                    }
                    setFeedback({
                        message: (
                            <>
                                <Title>What happens next</Title>
                                <Paragraph>
                                    {positiveFeedback()} {feedbackMessage}{" "}
                                    {genericFeedbackMessage}
                                </Paragraph>
                            </>
                        ),
                    });
                }

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
                            setActivityStateForCleaning(
                                {
                                    ...activityState,
                                    didVacuuming: true,
                                },
                                <>You vaccumed away the dust.</>,
                            );
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
                            setActivityStateForCleaning(
                                {
                                    ...activityState,
                                    didSweeping: true,
                                },
                                <>You sweeped the floor.</>,
                            );
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
                            setActivityStateForCleaning(
                                {
                                    ...activityState,
                                    didMopping: true,
                                },
                                <>You mopped the floor.</>,
                            );
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
                            setActivityStateForCleaning(
                                {
                                    ...activityState,
                                    didDusting: true,
                                },
                                <>You dusted the furniture and other items.</>,
                            );
                        },
                    });
            }
            break;
        default:
            throw new Error("unimplemented");
            activityState satisfies never;
    }

    {
        const _imageId = feedback?.imageId ?? imageId;
        return (
            <Container>
                {_imageId == "house" ? (
                    <ActivityImage key={_imageId}>
                        <HouseImage
                            didCleaning={didCleaning}
                            didDishes={didDishes}
                            didLaundry={didLaundry}
                            didCooking={didCooking}
                            didDinner={didDinner}
                        />
                    </ActivityImage>
                ) : (
                    _imageId != undefined &&
                    IMAGE_ID_TO_SRC[_imageId] != undefined && (
                        <ActivityImage
                            key={_imageId}
                            src={IMAGE_ID_TO_SRC[_imageId]}
                        />
                    )
                )}
                <StatsViewer stats={stats} />
                <Section>
                    {feedback === undefined && message !== undefined && message}
                    {feedback !== undefined && feedback.message}
                    {feedback !== undefined && oldStats !== undefined && (
                        <StatDeltaViewer oldStats={oldStats} newStats={stats} />
                    )}
                    {feedback === undefined && actions !== undefined && (
                        <ActionPanel title={actionPrompt} actions={actions} />
                    )}
                    {feedback !== undefined && (
                        <>
                            <PrimaryButton
                                onClick={() => setFeedback(undefined)}
                            >
                                Continue
                            </PrimaryButton>
                        </>
                    )}
                </Section>
            </Container>
        );
    }
}

export default IndoorDomesticActivity;
