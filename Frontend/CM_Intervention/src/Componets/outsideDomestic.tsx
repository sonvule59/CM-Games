import React, { useMemo, useState } from 'react';
import { href, useNavigate } from 'react-router';
import { ActionPanel, SecondaryActionPanel } from "./ActionPanel.tsx";
import { statsUpdate, StatsPanel, StatDelta } from "./StatsPanel.tsx";

import outdoorDomesticHubImg from '../images/walkingHome.png';
import groceryShoppingImg from '../images/groceryShopping.png';
import bringingGroceriesInImg from '../images/bringingGroceriesIn.png';
import gardeningImg from '../images/gardening.png';
import gardenWateringImg from '../images/gardenWatering.png';
import plantingandWeedingImg from '../images/plantingandWeeding.png';
import takingOutTrashImg from '../images/takingOutTrash.png';
import recylingImg from '../images/recyling.png';
import cleaningWindowsImg from '../images/cleaningWindows.png';
import washingDogsImg from '../images/washingDogs.png';
import walkingDogsImg from '../images/walkingDogs.png';
import washingOutsideofCarImg from '../images/washingOutsideofCar.png';
import cleaningInsideCarImg from '../images/cleaningInsideCar.png';
import maintainanceRepairImg from '../images/maintainanceRepair.png';
import paintingHouseImg from '../images/paintingHouse.png';
import {
  BackButton,
  Container,
  Header,
  HeaderLeft,
  HeaderRight,
  HeaderSubtitle,
  MainTitle,
  Paragraph,
  ResetButton,
  ScenePill,
  Section,
  Title,
  TopRow,
} from "./Layout.tsx";
import ActivityImage from "./ActivityImage.tsx";

/**
 * OutsideDomestic: "around the house" activity selector with light branching.
 *
 * Structure:
 * - A data-driven `ACTIVITIES` list (copy + stat deltas + optional choice images)
 * - A tiny step-based flow (intro → activity intro → activity choice → result)
 * - Stats updates are centralized through `statsUpdate` for consistent clamping/merging
 */
const ACTIVITIES = [
  {
    id: "grocery",
    title: "Grocery Shopping",
    icon: "🛒",
    image: groceryShoppingImg,
    choiceImages: {
      steady: groceryShoppingImg,
      extra: bringingGroceriesInImg,
    },
    intro:
      "You head to the store with a short list. The aisles are busy, but you can move at your own pace—one item at a time.",
    choices: [
      {
        id: "steady",
        label: "Take it steady (grab the essentials)",
        delta: { energy: +2, confidence: +6, mood: +4, health: +2 },
        result:
          "You keep it simple and efficient. You find what you need, take a couple calm breaths in the checkout line, and leave feeling capable.",
      },
      {
        id: "extra",
        label: "Do a full restock (carry a bit more)",
        delta: { energy: +4, confidence: +9, mood: +3, health: +4 },
        result:
          "You tackle a bigger haul. It takes more effort, but you manage it thoughtfully—lighter bags, more trips, and a little pride when you’re done.",
      },
    ],
  },
  {
    id: "gardening",
    title: "Gardening",
    icon: "🌱",
    image: gardeningImg,
    choiceImages: {
      light: gardenWateringImg,
      dig: plantingandWeedingImg,
    },
    intro:
      "Outside, you notice the plants could use a little attention. Gardening is small movements that add up—gentle and steady.",
    choices: [
      {
        id: "light",
        label: "Water + quick tidy",
        delta: { energy: +2, confidence: +4, mood: +6, health: +3 },
        result:
          "You water, do a quick check, and tidy a couple spots. The fresh air helps, and the progress feels satisfying.",
      },
      {
        id: "dig",
        label: "Plant + weed for a while",
        delta: { energy: +4, confidence: +7, mood: +6, health: +6 },
        result:
          "You settle in and do more hands‑on work—pulling weeds, planting, and moving around the yard. You finish with a “wow, I did that” kind of calm.",
      },
    ],
  },
  {
    id: "trash",
    title: "Taking Out the Trash",
    icon: "🗑️",
    image: takingOutTrashImg,
    choiceImages: {
      single: takingOutTrashImg,
      double: recylingImg,
    },
    intro:
      "It’s trash day. This one is quick, practical, and surprisingly good for building momentum.",
    choices: [
      {
        id: "single",
        label: "One trip (just the main bag)",
        delta: { energy: +2, confidence: +3, mood: +2, health: +1 },
        result:
          "You handle the main bag and get it done. A small win, but a real one—and it clears mental space.",
      },
      {
        id: "double",
        label: "Two trips (bins + recycling)",
        delta: { energy: +4, confidence: +5, mood: +3, health: +2 },
        result:
          "You finish the whole set—trash and recycling. It’s more steps, but the “all taken care of” feeling hits nicely.",
      },
    ],
  },
  {
    id: "windows",
    title: "Cleaning Windows",
    icon: "🪟",
    image: cleaningWindowsImg,
    choiceImages: {
      spot: cleaningWindowsImg,
      all: cleaningWindowsImg,
    },
    intro:
      "Sunlight shows the smudges. Window cleaning is a mix of reaching, wiping, and little resets that make a room feel brighter.",
    choices: [
      {
        id: "spot",
        label: "Spot clean the worst spots",
        delta: { energy: +2, confidence: +4, mood: +4, health: +3 },
        result:
          "You hit the places that bug you most. The difference is immediate—cleaner light and a quick sense of control.",
      },
      {
        id: "all",
        label: "Do a full pass (inside + outside)",
        delta: { energy: +4, confidence: +7, mood: +5, health: +5 },
        result:
          "You take your time and do a full pass. It’s effort, but the payoff is huge—everything looks crisp and new.",
      },
    ],
  },
  {
    id: "pet",
    title: "Pet Care",
    icon: "🐾",
    image: washingDogsImg,
    choiceImages: {
      feed: washingDogsImg,
      walk: walkingDogsImg,
    },
    intro:
      "Your pet is ready for attention. The goal is simple: care + connection—movement comes naturally.",
    choices: [
      {
        id: "feed",
        label: "Feed + play for a bit",
        delta: { energy: +2, confidence: +4, mood: +8, health: +1 },
        result:
          "You feed them and play. The joy is immediate, and your mood gets a quick boost from the connection.",
      },
      {
        id: "walk",
        label: "Take a short walk together",
        delta: { energy: +4, confidence: +5, mood: +9, health: +5 },
        result:
          "You head out for a short walk. It’s steady movement with a built‑in reason to be outside, and you come back lighter.",
      },
    ],
  },
  {
    id: "carwash",
    title: "Car Washing",
    icon: "🚗",
    image: washingOutsideofCarImg,
    choiceImages: {
      quick: washingOutsideofCarImg,
      detail: cleaningInsideCarImg,
    },
    intro:
      "The car could use a refresh. A wash is repetitive movement with a clear finish line—very satisfying.",
    choices: [
      {
        id: "quick",
        label: "Quick wash (outside only)",
        delta: { energy: +2, confidence: +6, mood: +4, health: +4 },
        result:
          "You do a quick wash and wipe down. The car looks better fast, and the “done” feeling lands right away.",
      },
      {
        id: "detail",
        label: "Full clean (inside + outside)",
        delta: { energy: +4, confidence: +9, mood: +5, health: +5 },
        result:
          "You go all in—vacuum, wipe, and wash. It takes more energy, but the results feel premium, like you reset your whole week.",
      },
    ],
  },
  {
    id: "maintenance",
    title: "Home Maintenance",
    icon: "🛠️",
    image: maintainanceRepairImg,
    choiceImages: {
      tiny: maintainanceRepairImg,
      project: paintingHouseImg,
    },
    intro:
      "A small repair or project is calling your name. This is practical skill-building—slow, careful progress is the win.",
    choices: [
      {
        id: "tiny",
        label: "Small fix (tighten/replace/patch)",
        delta: { energy: +2, confidence: +8, mood: +3, health: +2 },
        result:
          "You complete a small fix. It’s not flashy, but it’s real competence—and your space works better because of you.",
      },
      {
        id: "project",
        label: "Mini project (paint/assemble)",
        delta: { energy: +4, confidence: +10, mood: +4, health: +3 },
        result:
          "You take on a mini project. It’s more steps and more patience, but you finish with that “I built something” satisfaction.",
      },
    ],
  },
] as const;

const SCENE_PILLS = {
  intro: 'Outside domestic',
  activityIntro: 'Getting started',
  activityChoice: 'Make a choice',
  result: 'Nice work',
};

export default function OutsideDomestic() {
  const navigate = useNavigate();

  // Baseline stats are memoized so reset() can reliably restore the same object shape.
  const initialStats = useMemo(
    () => ({
      energy: 50,
      confidence: 50,
      mood: 50,
      health: 50,
    }),
    [],
  );

  const [stats, setStats] = useState(initialStats);
  const [step, setStep] = useState<
    "intro" | "activityIntro" | "activityChoice" | "result"
  >("intro");
  const [activityId, setActivityId] = useState<
    (typeof ACTIVITIES)[number]["id"] | null
  >(null);
  const [lastChoiceId, setLastChoiceId] = useState<
    (typeof ACTIVITIES)[number]["choices"][number]["id"] | null
  >(null);
  const [resultText, setResultText] = useState('');

  const applyDelta = (delta: StatDelta) => {
    setStats((prev) =>
      statsUpdate(prev, {
        energy: delta.energy ?? 0,
        confidence: delta.confidence ?? 0,
        mood: delta.mood ?? 0,
        health: delta.health ?? 0,
      }),
    );
  };

  const activity = ACTIVITIES.find((a) => a.id === activityId) || null;

  // Picks the most relevant scene image: hub → activity image → (optional) choice-specific image.
  const sceneImageSrc = useMemo(() => {
    if (!activity) return outdoorDomesticHubImg;
    if (
      step === "result" &&
      lastChoiceId &&
      (activity.choiceImages as { [_: string]: string })?.[lastChoiceId]
    ) {
      return (activity.choiceImages as { [_: string]: string })[lastChoiceId];
    }
    return activity.image;
  }, [activity, step, lastChoiceId]);

  // const reset = () => {
  //   setStats(initialStats);
  //   setStep('intro');
  //   setActivityId(null);              commented out as the reset button was removed.
  //   setLastChoiceId(null);
  //   setResultText('');
  // };

  const backToActivities = () => {
    setStep('intro');
    setActivityId(null);
    setLastChoiceId(null);
    setResultText('');
  };

  const startActivity = (id: (typeof ACTIVITIES)[number]["id"]) => {
    setActivityId(id);
    setStep("activityIntro");
    setLastChoiceId(null);
    setResultText("");
  };

  const chooseActivityOption = (
    choiceId: (typeof ACTIVITIES)[number]["choices"][number]["id"],
  ) => {
    if (!activity) return;
    const choice = activity.choices.find((c) => c.id === choiceId);
    if (!choice) return;
    applyDelta(choice.delta);
    setLastChoiceId(choiceId);
    setResultText(choice.result);
    setStep("result");
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <MainTitle>Outside Domestic Activities</MainTitle>
          <HeaderSubtitle>
            Everyday tasks that still count as movement. Pick what fits your
            day, then choose how big you want it to be.
          </HeaderSubtitle>
          <ScenePill>{SCENE_PILLS[step]}</ScenePill>
        </HeaderLeft>

        <HeaderRight>
          <BackButton onClick={() => navigate(href("/domestic-home"))}>
            Back
          </BackButton>
          {/* <ResetButton onClick={reset}>Reset</ResetButton> */}
        </HeaderRight>
      </Header>

      <TopRow>
        <StatsPanel stats={stats} />
      </TopRow>

      <ActivityImage
        src={sceneImageSrc}
        subtitle={
          activity ? `${activity.icon} ${activity.title}` : "Around the home"
        }
      />

      {step === "intro" && (
        <Section>
          <Title>Pick an outside activity</Title>
          <Paragraph>
            You can keep it small and get a quick win, or do a bigger version
            and feel the progress.
          </Paragraph>
          <ActionPanel
            actions={ACTIVITIES.map((a) => ({
              id: a.id,
              icon: a.icon,
              label: a.title,
              action: () => startActivity(a.id),
            }))}
          />
        </Section>
      )}

      {step === "activityIntro" && activity && (
        <Section>
          <Title>{activity.title}</Title>
          <Paragraph>{activity.intro}</Paragraph>
          <SecondaryActionPanel
            actions={[
              {
                id: `${activity.id}-continue`,
                isPrimary: true,
                label: "Continue",
                action: () => setStep("activityChoice"),
              },
              {
                id: `${activity.id}-intro-back`,
                isPrimary: false,
                label: "Back to activities",
                action: backToActivities,
              },
            ]}
          />
        </Section>
      )}

      {step === "activityChoice" && activity && (
        <Section>
          <Title>How do you want to do it?</Title>
          <Paragraph>
            Pick the version that matches your energy today.
          </Paragraph>
          <ActionPanel
            actions={[
              ...activity.choices.map((c) => ({
                id: `${activity.id}-${c.id}`,
                label: c.label,
                isPrimary: true,
                action: () => chooseActivityOption(c.id),
              })),
              {
                id: `${activity.id}-choice-back`,
                isPrimary: false,
                label: "Back to activities",
                action: backToActivities,
              },
            ]}
          />
        </Section>
      )}

      {step === "result" && (
        <Section>
          <Title>How it went</Title>
          <Paragraph>{resultText}</Paragraph>
          <ActionPanel
            actions={[
              {
                id: "result-back",
                isPrimary: true,
                label: "Back to activities",
                action: backToActivities,
              },
            ]}
          />
        </Section>
      )}
    </Container>
  );
}

