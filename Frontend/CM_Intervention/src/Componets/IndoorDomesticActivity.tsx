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
import { href, useNavigate } from "react-router-dom";

type IndoorDomesticActivityProps = {};

// Undefined means image isn't available yet,
// a placeholder will be shown for now.
const IMAGE_ID_TO_SRC = {
    cleaningThinking: undefined,
    vacuuming: undefined,
    sweeping: undefined,
    dusting: undefined,
    mopping: undefined,
    lookAtDirtyDishes: undefined,
    putDishesInDishwasher: undefined,
    lookAtDirtyDishesInDishwasher: undefined,
    startDishwasher: undefined,
    lookAtFinishedDishwasher: undefined,
    getDishesOutOfDishwasher: undefined,
    lookAtCleanDishes: undefined,
    lookAtDirtyClothes: undefined,
    pickUpDirtyLaundry: undefined,
    lookAtDirtyClothesInWasher: undefined,
    washClothes: undefined,
    lookAtCleanWetClothesInWasher: undefined,
    dryClothes: undefined,
    lookAtCleanDryClothesInDryer: undefined,
    foldCleanClothes: undefined,
    lookAtUnmadeBed: undefined,
    makeBed: undefined,
    cookingThinking: undefined,
    lookAtPantry: undefined,
    cookDinner: undefined,
    finishedDinner: undefined,
    eatDinner: undefined,
} satisfies Record<string, string | undefined>;

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
}: {
    didCleaning: boolean;
    didDishes: boolean;
    didLaundry: boolean;
    didCooking: boolean;
}) {
    return (
        <svg
            viewBox="0 0 720 400"
            xmlns="http://www.w3.org/2000/svg"
            width={"auto"}
            height={"auto"}
        >
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
                        viewBox={
                            didDishes ? "3500 0 3500 5000" : "0 0 3500 5000"
                        }
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
        </svg>
    );
}

function IndoorDomesticActivity({}: IndoorDomesticActivityProps) {
    const navigate = useNavigate();

    type ImageID = "house" | keyof typeof IMAGE_ID_TO_SRC | undefined;

    let actions: Array<ActionSpec>;
    let actionPrompt: string | undefined = undefined;
    let imageId: ImageID;
    let message: React.ReactNode = undefined;
    let scenePillLabel: React.ReactNode;

    const [stats, _setStats] = useState<Stats>(STARTING_STATS);
    const [oldStats, _setOldStats] = useState<Stats | undefined>(undefined);
    const [didCleaning, setDidCleaning] = useState<boolean>(false);
    const [didDishes, setDidDishes] = useState<boolean>(false);
    const [didLaundry, setDidLaundry] = useState<boolean>(false);
    const [didCooking, setDidCooking] = useState<boolean>(false);

    function reset() {
        _setStats(STARTING_STATS);
        _setOldStats(undefined);
        setDidCleaning(false);
        setDidDishes(false);
        setDidLaundry(false);
        setDidCooking(false);
        setActivityState({ activity: "overview" });
        setFeedback(undefined);
    }

    function setStats(newStats: Stats) {
        _setOldStats(stats);
        _setStats(newStats);
    }

    function goBack() {
        navigate(href("/"));
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
        | { activity: "dishes"; sequence: 0 | 1 | 2 }
        | { activity: "laundry"; sequence: 0 | 1 | 2 | 3 | 4 }
        | { activity: "cooking"; sequence: 0 | 1 }
    >;
    const [activityState, setActivityState] = useState<ActivityState>({
        activity: "overview",
    });

    type FeedbackState = Readonly<{
        message: React.ReactNode;
        imageId?: ImageID;
        isFinalForActivity?: boolean;
        closeAction?: () => void;
    }>;
    const [feedback, setFeedback] = useState<FeedbackState | undefined>(
        undefined,
    );
    function setFeedbackSequence(...feedbacks: readonly FeedbackState[]) {
        const newFeedbacks: FeedbackState[] = Array(feedbacks.length);
        for (let _i = 0; _i < feedbacks.length; _i++) {
            const i = _i;
            newFeedbacks[i] = {
                message: feedbacks[i].message,
                imageId: feedbacks[i].imageId,
                isFinalForActivity: feedbacks[i].isFinalForActivity,
                closeAction() {
                    if (i + 1 == feedbacks.length) {
                        if (feedbacks[i].closeAction == undefined) {
                            setFeedback(undefined);
                        } else {
                            feedbacks[i].closeAction();
                        }
                    } else {
                        setFeedback(feedbacks[i + 1]);
                        feedbacks[i].closeAction?.();
                    }
                },
            };
        }
        if (feedbacks.length > 0) setFeedback(newFeedbacks[0]);
    }

    switch (activityState.activity) {
        case "overview":
            scenePillLabel = "Indoor domestic";
            imageId = "house";
            actionPrompt = "Choose an activity";
            actions = [];
            if (!didCleaning)
                actions.push({
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
                        setFeedback({
                            imageId: "cleaningThinking",
                            message: (
                                <>
                                    <Title>Cleaning the house</Title>
                                    <Paragraph>
                                        You've decided to start cleaning your
                                        home. It looks pretty messy right now,
                                        but you're determined to make it clean.
                                        What should you do first?
                                    </Paragraph>
                                </>
                            ),
                        });
                    },
                });
            if (!didDishes)
                actions.push({
                    id: "startDishes",
                    label: "Dishes",
                    icon: "🧽",
                    desc: "Clean the dishes",
                    action() {
                        setFeedback({
                            imageId: "lookAtDirtyDishes",
                            message: (
                                <>
                                    <Title>Cleaning the dishes</Title>
                                    <Paragraph>
                                        It's time to start cleaning the dishes.
                                        It will take some amount of work, but
                                        should be quick enough.
                                    </Paragraph>
                                </>
                            ),
                        });
                        setActivityState({ activity: "dishes", sequence: 0 });
                    },
                });
            if (!didLaundry)
                actions.push({
                    id: "startLaundry",
                    label: "Laundry",
                    icon: "🧺",
                    desc: "Do the laundry",
                    action() {
                        setFeedback({
                            imageId: "lookAtDirtyClothes",
                            message: (
                                <>
                                    <Title>Doing the laundry</Title>
                                    <Paragraph>
                                        It's time to start doing the laundry.
                                        While you're at it, you also plan to
                                        wash your bedsheets and make your bed.
                                    </Paragraph>
                                </>
                            ),
                        });
                        setActivityState({ activity: "laundry", sequence: 0 });
                    },
                });
            if (!didCooking)
                actions.push({
                    id: "startCooking",
                    label: "Cook",
                    icon: "🍲",
                    desc: "Cook some food",
                    action() {
                        setFeedback({
                            imageId: "cookingThinking",
                            message: (
                                <>
                                    <Title>Cooking dinner</Title>
                                    <Paragraph>
                                        You feel a bit tired and hungry, and
                                        decide it's time to cook some dinner.
                                    </Paragraph>
                                </>
                            ),
                        });
                        setActivityState({ activity: "cooking", sequence: 0 });
                    },
                });
            if (actions.length == 0) {
                imageId = "house";
                actionPrompt = undefined;
                message = (
                    <>
                        <Paragraph>
                            Looks like there's nothing left to do.{" "}
                            {positiveFeedback()}
                        </Paragraph>
                        <PrimaryButton onClick={goBack}>Go Back</PrimaryButton>
                    </>
                );
            }
            break;
        case "cleaning":
            scenePillLabel = "Cleaning the house";
            imageId = "cleaningThinking";
            {
                function setActivityStateForCleaning(
                    newActivityState: ActivityState & { activity: "cleaning" },
                    imageId: ImageID,
                    feedbackMessage: React.ReactNode,
                ) {
                    const numActivitiesCompleted: 0 | 1 | 2 | 3 | 4 =
                        ((newActivityState.didVacuuming ? 1 : 0) +
                            (newActivityState.didSweeping ? 1 : 0) +
                            (newActivityState.didMopping ? 1 : 0) +
                            (newActivityState.didDusting ? 1 : 0)) as any;
                    const allActivitiesCompleted = numActivitiesCompleted === 4;
                    let _newActivityState: ActivityState;
                    if (allActivitiesCompleted) {
                        _newActivityState = {
                            activity: "overview",
                        };
                        setDidCleaning(true);
                    } else {
                        _newActivityState = newActivityState;
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
                                </Paragraph>
                                <Paragraph>{genericFeedbackMessage}</Paragraph>
                            </>
                        ),
                        imageId,
                        isFinalForActivity: allActivitiesCompleted,
                        closeAction() {
                            setActivityState(_newActivityState);
                            setFeedback(undefined);
                        },
                    });
                    setStats(
                        statsUpdate(stats, {
                            energy: -10,
                            mood: +5,
                            confidence: +5,
                        }),
                    );
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
                            setActivityStateForCleaning(
                                {
                                    ...activityState,
                                    didVacuuming: true,
                                },
                                "vacuuming",
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
                            setActivityStateForCleaning(
                                {
                                    ...activityState,
                                    didSweeping: true,
                                },
                                "sweeping",
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
                            setActivityStateForCleaning(
                                {
                                    ...activityState,
                                    didMopping: true,
                                },
                                "mopping",
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
                            setActivityStateForCleaning(
                                {
                                    ...activityState,
                                    didDusting: true,
                                },
                                "dusting",
                                <>You dusted the furniture and other items.</>,
                            );
                        },
                    });
            }
            break;
        case "dishes":
            scenePillLabel = "Cleaning the dishes";
            switch (activityState.sequence) {
                case 0:
                    imageId = "lookAtDirtyDishes";
                    message = (
                        <Paragraph>
                            First, it's time to put the dirty dishes in the
                            dishwasher.
                        </Paragraph>
                    );
                    actions = [
                        {
                            id: "next0",
                            label: "Place dishes in dishwasher",
                            desc: "Put the dirty dishes in the dishwasher.",
                            action() {
                                setStats(
                                    statsUpdate(stats, {
                                        energy: -5,
                                    }),
                                );
                                setActivityState({
                                    ...activityState,
                                    sequence: 1,
                                });
                                setFeedback({
                                    imageId: "putDishesInDishwasher",
                                    message: (
                                        <Paragraph>
                                            You put the dirty dishes in the
                                            dishwasher.
                                        </Paragraph>
                                    ),
                                });
                            },
                        },
                    ];
                    break;
                case 1:
                    imageId = "lookAtDirtyDishesInDishwasher";
                    message = (
                        <Paragraph>
                            The dishes are in the dishwasher. Now it's time to
                            start it up!
                        </Paragraph>
                    );
                    actions = [
                        {
                            id: "next1",
                            label: "Start the dishwasher",
                            action() {
                                setStats(
                                    statsUpdate(stats, {
                                        energy: -5,
                                    }),
                                );
                                setActivityState({
                                    ...activityState,
                                    sequence: 2,
                                });
                                setFeedback({
                                    imageId: "startDishwasher",
                                    message: (
                                        <Paragraph>
                                            You start up the dishwasher. It's
                                            time to wait for it to finish.
                                        </Paragraph>
                                    ),
                                });
                            },
                        },
                    ];
                    break;
                case 2:
                    imageId = "lookAtFinishedDishwasher";
                    message = (
                        <Paragraph>
                            {positiveFeedback()} The dishwasher has finished.
                        </Paragraph>
                    );
                    actions = [
                        {
                            id: "next2",
                            label: "Pick up dishes",
                            desc: "Pick up the clean dishes from the dishwasher.",
                            action() {
                                setDidDishes(true);
                                setStats(statsUpdate(stats, { energy: -5 }));
                                setFeedbackSequence(
                                    {
                                        imageId: "getDishesOutOfDishwasher",
                                        message: (
                                            <Paragraph>
                                                You get the dishes out of the
                                                dishwasher, and put them back on
                                                the table.
                                            </Paragraph>
                                        ),
                                        closeAction() {
                                            setStats(
                                                statsUpdate(stats, {
                                                    mood: +20,
                                                    confidence: +20,
                                                    health: +10,
                                                }),
                                            );
                                        },
                                    },
                                    {
                                        imageId: "lookAtCleanDishes",
                                        message: (
                                            <Paragraph>
                                                {positiveFeedback()} The dishes
                                                are complete! You feel proud.
                                            </Paragraph>
                                        ),
                                        isFinalForActivity: true,
                                        closeAction() {
                                            setActivityState({
                                                activity: "overview",
                                            });
                                            setFeedback(undefined);
                                        },
                                    },
                                );
                            },
                        },
                    ];
                    break;
                default:
                    activityState satisfies never;
                    throw new Error();
            }
            break;
        case "laundry":
            scenePillLabel = "Doing the laundry";
            switch (activityState.sequence) {
                case 0:
                    imageId = "lookAtDirtyClothes";
                    message = (
                        <Paragraph>
                            First, it's time to put the dirty clothes in the
                            washer.
                        </Paragraph>
                    );
                    actions = [
                        {
                            id: "next0",
                            label: "Pick up dirty clothes",
                            desc: "Pick up the dirty clothes, and put them in the washer.",
                            action() {
                                setStats(
                                    statsUpdate(stats, {
                                        energy: -5,
                                    }),
                                );
                                setActivityState({
                                    ...activityState,
                                    sequence: 1,
                                });
                                setFeedback({
                                    imageId: "pickUpDirtyLaundry",
                                    message: (
                                        <Paragraph>
                                            You picked up the dirty clothes, and
                                            put them in the washer.
                                        </Paragraph>
                                    ),
                                });
                            },
                        },
                    ];
                    break;
                case 1:
                    imageId = "lookAtDirtyClothesInWasher";
                    message = (
                        <Paragraph>
                            The clothes are in the washing machine. Now it's
                            time to start it up!
                        </Paragraph>
                    );
                    actions = [
                        {
                            id: "next1",
                            label: "Start the washing machine",
                            action() {
                                setStats(
                                    statsUpdate(stats, {
                                        energy: -5,
                                    }),
                                );
                                setActivityState({
                                    ...activityState,
                                    sequence: 2,
                                });
                                setFeedback({
                                    imageId: "washClothes",
                                    message: (
                                        <Paragraph>
                                            You start up the washer. It's time
                                            to wait for it to finish.
                                        </Paragraph>
                                    ),
                                });
                            },
                        },
                    ];
                    break;
                case 2:
                    imageId = "lookAtCleanWetClothesInWasher";
                    message = (
                        <Paragraph>
                            {positiveFeedback()} The clothes have finished
                            washing.
                        </Paragraph>
                    );
                    actions = [
                        {
                            id: "next2",
                            label: "Dry the clothes",
                            desc: "Pick up the clean clothes and place them in the dryer.",
                            action() {
                                setStats(
                                    statsUpdate(stats, {
                                        energy: -5,
                                    }),
                                );
                                setActivityState({
                                    ...activityState,
                                    sequence: 3,
                                });
                                setFeedback({
                                    imageId: "dryClothes",
                                    message: (
                                        <Paragraph>
                                            You start up the dryer. It's time to
                                            wait for it to finish.
                                        </Paragraph>
                                    ),
                                });
                            },
                        },
                    ];
                    break;
                case 3:
                    imageId = "lookAtCleanDryClothesInDryer";
                    message = (
                        <Paragraph>
                            {positiveFeedback()} The clothes have finished
                            drying.
                        </Paragraph>
                    );
                    actions = [
                        {
                            id: "next3",
                            label: "Fold clothes",
                            desc: "Fold the clothes and put them back.",
                            action() {
                                setStats(
                                    statsUpdate(stats, {
                                        energy: -10,
                                    }),
                                );
                                setActivityState({
                                    ...activityState,
                                    sequence: 4,
                                });
                                setFeedback({
                                    imageId: "foldCleanClothes",
                                    message: (
                                        <Paragraph>
                                            {positiveFeedback()} You fold the
                                            clean clothes and put them back. You
                                            feel accomplished.
                                        </Paragraph>
                                    ),
                                });
                            },
                        },
                    ];
                    break;
                case 4:
                    imageId = "lookAtUnmadeBed";
                    message = (
                        <Paragraph>
                            However, you still have your bedsheets. Now it's
                            time to put them back on your bed.
                        </Paragraph>
                    );
                    actions = [
                        {
                            id: "next4",
                            label: "Make bed",
                            desc: "Make your bed.",
                            action() {
                                setDidLaundry(true);
                                setStats(
                                    statsUpdate(stats, {
                                        energy: -10,
                                        mood: +50,
                                        health: +10,
                                        confidence: +20,
                                    }),
                                );
                                setFeedback({
                                    imageId: "makeBed",
                                    message: (
                                        <Paragraph>
                                            {positiveFeedback()} You feel
                                            accomplished, and now you have a
                                            freshly-made bed and freshly-folded
                                            clothes!
                                        </Paragraph>
                                    ),
                                    closeAction() {
                                        setStats(
                                            statsUpdate(stats, {
                                                mood: +20,
                                                confidence: +20,
                                                health: +10,
                                            }),
                                        );
                                        setActivityState({
                                            activity: "overview",
                                        });
                                        setFeedback(undefined);
                                    },
                                    isFinalForActivity: true,
                                });
                            },
                        },
                    ];
                    break;
                default:
                    activityState satisfies never;
                    throw new Error();
            }
            break;
        case "cooking":
            scenePillLabel = "Cooking dinner";
            switch (activityState.sequence) {
                case 0: {
                    message = (
                        <>
                            <Title>Planning your meal</Title>
                            <Paragraph>
                                You look at your pantry to decide what to make
                                for dinner.
                            </Paragraph>
                        </>
                    );
                    imageId = "lookAtPantry";
                    const meals = [
                        { name: "Pizza", icon: "🍕" },
                        { name: "Spaghetti", icon: "🍝" },
                        { name: "Salad", icon: "🥗" },
                        { name: "Sandwich", icon: "🥪" },
                        { name: "Curry and rice", icon: "🍛" },
                        { name: "Dumplings", icon: "🥟" },
                    ];
                    actions = meals.map(({ name, icon }) => ({
                        key: name,
                        label: name,
                        icon: icon,
                        action() {
                            setStats(statsUpdate(stats, { energy: -10 }));
                            setActivityState({ ...activityState, sequence: 1 });
                            setFeedback({
                                imageId: "cookDinner",
                                message: (
                                    <Paragraph>
                                        Good choice! You cook your dinner.
                                    </Paragraph>
                                ),
                            });
                        },
                    }));
                    break;
                }
                case 1:
                    imageId = "finishedDinner";
                    message = (
                        <Paragraph>
                            After cooking, your dinner is ready to eat.
                        </Paragraph>
                    );
                    actions = [
                        {
                            key: "eatDinner",
                            label: "Eat dinner",
                            icon: "🍽️",
                            desc: "Enjoy your dinner.",
                            action() {
                                setStats(statsUpdate(stats, { energy: +100 }));
                                setDidCooking(true);
                                setFeedback({
                                    imageId: "eatDinner",
                                    message: (
                                        <>
                                            <Paragraph>
                                                {positiveFeedback()} After
                                                enjoying your meal, you feel
                                                replenished.
                                            </Paragraph>
                                        </>
                                    ),
                                    isFinalForActivity: true,
                                    closeAction() {
                                        setActivityState({
                                            activity: "overview",
                                        });
                                        setFeedback(undefined);
                                    },
                                });
                            },
                        },
                    ];
                    break;
                default:
                    activityState satisfies never;
                    throw new Error();
            }
            break;
        default:
            activityState satisfies never;
            throw new Error();
    }

    {
        const _imageId = feedback?.imageId ?? imageId;
        return (
            <Container>
                <Header>
                    <HeaderLeft>
                        <MainTitle>Indoor Domestic Activities</MainTitle>
                        <HeaderSubtitle>
                            Everyday tasks that still count as movement. Pick
                            what fits your day, then choose how big you want it
                            to be.
                        </HeaderSubtitle>
                        <ScenePill>{scenePillLabel}</ScenePill>
                    </HeaderLeft>
                    <HeaderRight>
                        <BackButton
                            onClick={() => navigate(href("/domestic-home"))}
                        />
                    </HeaderRight>
                </Header>
                <TopRow>
                    <StatsViewer stats={stats} />
                </TopRow>
                {_imageId == "house" ? (
                    <ActivityImage key={_imageId}>
                        <HouseImage
                            didCleaning={didCleaning}
                            didDishes={didDishes}
                            didLaundry={didLaundry}
                            didCooking={didCooking}
                        />
                    </ActivityImage>
                ) : !(_imageId != undefined && _imageId in IMAGE_ID_TO_SRC) ? (
                    <></>
                ) : IMAGE_ID_TO_SRC[_imageId] != undefined ? (
                    <ActivityImage
                        key={_imageId}
                        src={IMAGE_ID_TO_SRC[_imageId]}
                    />
                ) : (
                    <ActivityImage key={_imageId}>
                        Placeholder: {_imageId}
                    </ActivityImage>
                )}
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
                                onClick={
                                    feedback.closeAction ??
                                    (() => setFeedback(undefined))
                                }
                            >
                                {feedback.isFinalForActivity ? (
                                    <>Finish</>
                                ) : (
                                    <>Continue</>
                                )}
                            </PrimaryButton>
                        </>
                    )}
                </Section>
            </Container>
        );
    }
}

export default IndoorDomesticActivity;
