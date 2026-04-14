import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { rcStyles } from '../Static/rockClimbingStyles';
import { ActionPanel } from './ActionPanel.tsx';
import { statsUpdate, StatsPanel } from './StatsPanel.tsx';

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

const ACTIVITIES = [
  {
    id: 'grocery',
    title: 'Grocery Shopping',
    icon: '🛒',
    image: groceryShoppingImg,
    choiceImages: {
      steady: groceryShoppingImg,
      extra: bringingGroceriesInImg,
    },
    intro:
      'You head to the store with a short list. The aisles are busy, but you can move at your own pace—one item at a time.',
    choices: [
      {
        id: 'steady',
        label: 'Take it steady (grab the essentials)',
        delta: { energy: -6, confidence: +6, mood: +4, mobility: +2 },
        result:
          'You keep it simple and efficient. You find what you need, take a couple calm breaths in the checkout line, and leave feeling capable.',
      },
      {
        id: 'extra',
        label: 'Do a full restock (carry a bit more)',
        delta: { energy: -12, confidence: +9, mood: +3, mobility: +4 },
        result:
          'You tackle a bigger haul. It takes more effort, but you manage it thoughtfully—lighter bags, more trips, and a little pride when you’re done.',
      },
    ],
  },
  {
    id: 'gardening',
    title: 'Gardening',
    icon: '🌱',
    image: gardeningImg,
    choiceImages: {
      light: gardenWateringImg,
      dig: plantingandWeedingImg,
    },
    intro:
      'Outside, you notice the plants could use a little attention. Gardening is small movements that add up—gentle and steady.',
    choices: [
      {
        id: 'light',
        label: 'Water + quick tidy',
        delta: { energy: -4, confidence: +4, mood: +6, mobility: +3 },
        result:
          'You water, do a quick check, and tidy a couple spots. The fresh air helps, and the progress feels satisfying.',
      },
      {
        id: 'dig',
        label: 'Plant + weed for a while',
        delta: { energy: -10, confidence: +7, mood: +6, mobility: +6 },
        result:
          'You settle in and do more hands‑on work—pulling weeds, planting, and moving around the yard. You finish with a “wow, I did that” kind of calm.',
      },
    ],
  },
  {
    id: 'trash',
    title: 'Taking Out the Trash',
    icon: '🗑️',
    image: takingOutTrashImg,
    choiceImages: {
      single: takingOutTrashImg,
      double: recylingImg,
    },
    intro:
      'It’s trash day. This one is quick, practical, and surprisingly good for building momentum.',
    choices: [
      {
        id: 'single',
        label: 'One trip (just the main bag)',
        delta: { energy: -3, confidence: +3, mood: +2, mobility: +1 },
        result:
          'You handle the main bag and get it done. A small win, but a real one—and it clears mental space.',
      },
      {
        id: 'double',
        label: 'Two trips (bins + recycling)',
        delta: { energy: -6, confidence: +5, mood: +3, mobility: +2 },
        result:
          'You finish the whole set—trash and recycling. It’s more steps, but the “all taken care of” feeling hits nicely.',
      },
    ],
  },
  {
    id: 'windows',
    title: 'Cleaning Windows',
    icon: '🪟',
    image: cleaningWindowsImg,
    choiceImages: {
      spot: cleaningWindowsImg,
      all: cleaningWindowsImg,
    },
    intro:
      'Sunlight shows the smudges. Window cleaning is a mix of reaching, wiping, and little resets that make a room feel brighter.',
    choices: [
      {
        id: 'spot',
        label: 'Spot clean the worst spots',
        delta: { energy: -5, confidence: +4, mood: +4, mobility: +3 },
        result:
          'You hit the places that bug you most. The difference is immediate—cleaner light and a quick sense of control.',
      },
      {
        id: 'all',
        label: 'Do a full pass (inside + outside)',
        delta: { energy: -11, confidence: +7, mood: +5, mobility: +5 },
        result:
          'You take your time and do a full pass. It’s effort, but the payoff is huge—everything looks crisp and new.',
      },
    ],
  },
  {
    id: 'pet',
    title: 'Pet Care',
    icon: '🐾',
    image: washingDogsImg,
    choiceImages: {
      feed: washingDogsImg,
      walk: walkingDogsImg,
    },
    intro:
      'Your pet is ready for attention. The goal is simple: care + connection—movement comes naturally.',
    choices: [
      {
        id: 'feed',
        label: 'Feed + play for a bit',
        delta: { energy: -3, confidence: +4, mood: +8, mobility: +1 },
        result:
          'You feed them and play. The joy is immediate, and your mood gets a quick boost from the connection.',
      },
      {
        id: 'walk',
        label: 'Take a short walk together',
        delta: { energy: -7, confidence: +5, mood: +9, mobility: +5 },
        result:
          'You head out for a short walk. It’s steady movement with a built‑in reason to be outside, and you come back lighter.',
      },
    ],
  },
  {
    id: 'carwash',
    title: 'Car Washing',
    icon: '🚗',
    image: washingOutsideofCarImg,
    choiceImages: {
      quick: washingOutsideofCarImg,
      detail: cleaningInsideCarImg,
    },
    intro:
      'The car could use a refresh. A wash is repetitive movement with a clear finish line—very satisfying.',
    choices: [
      {
        id: 'quick',
        label: 'Quick wash (outside only)',
        delta: { energy: -8, confidence: +6, mood: +4, mobility: +4 },
        result:
          'You do a quick wash and wipe down. The car looks better fast, and the “done” feeling lands right away.',
      },
      {
        id: 'detail',
        label: 'Full clean (inside + outside)',
        delta: { energy: -14, confidence: +9, mood: +5, mobility: +5 },
        result:
          'You go all in—vacuum, wipe, and wash. It takes more energy, but the results feel premium, like you reset your whole week.',
      },
    ],
  },
  {
    id: 'maintenance',
    title: 'Home Maintenance',
    icon: '🛠️',
    image: maintainanceRepairImg,
    choiceImages: {
      tiny: maintainanceRepairImg,
      project: paintingHouseImg,
    },
    intro:
      'A small repair or project is calling your name. This is practical skill-building—slow, careful progress is the win.',
    choices: [
      {
        id: 'tiny',
        label: 'Small fix (tighten/replace/patch)',
        delta: { energy: -6, confidence: +8, mood: +3, mobility: +2 },
        result:
          'You complete a small fix. It’s not flashy, but it’s real competence—and your space works better because of you.',
      },
      {
        id: 'project',
        label: 'Mini project (paint/assemble)',
        delta: { energy: -12, confidence: +10, mood: +4, mobility: +3 },
        result:
          'You take on a mini project. It’s more steps and more patience, but you finish with that “I built something” satisfaction.',
      },
    ],
  },
];

const SCENE_PILLS = {
  intro: 'Outside domestic',
  activityIntro: 'Getting started',
  activityChoice: 'Make a choice',
  result: 'Nice work',
};

export default function OutsideDomestic() {
  const navigate = useNavigate();

  const initialStats = useMemo(
    () => ({
      energy: 50,
      confidence: 50,
      mood: 50,
      mobility: 50,
    }),
    [],
  );

  const [stats, setStats] = useState(initialStats);
  const [step, setStep] = useState('intro'); // 'intro' | 'activityIntro' | 'activityChoice' | 'result'
  const [activityId, setActivityId] = useState(null);
  const [lastChoiceId, setLastChoiceId] = useState(null);
  const [resultText, setResultText] = useState('');

  const applyDelta = (delta) => {
    setStats((prev) =>
      statsUpdate(prev, {
        energy: delta.energy ?? 0,
        confidence: delta.confidence ?? 0,
        mood: delta.mood ?? 0,
        mobility: delta.mobility ?? 0,
      }),
    );
  };

  const activity = ACTIVITIES.find((a) => a.id === activityId) || null;

  const sceneImageSrc = useMemo(() => {
    if (!activity) return outdoorDomesticHubImg;
    if (step === 'result' && lastChoiceId && activity.choiceImages?.[lastChoiceId]) {
      return activity.choiceImages[lastChoiceId];
    }
    return activity.image;
  }, [activity, step, lastChoiceId]);

  const reset = () => {
    setStats(initialStats);
    setStep('intro');
    setActivityId(null);
    setLastChoiceId(null);
    setResultText('');
  };

  const backToActivities = () => {
    setStep('intro');
    setActivityId(null);
    setLastChoiceId(null);
    setResultText('');
  };

  const startActivity = (id) => {
    setActivityId(id);
    setStep('activityIntro');
    setLastChoiceId(null);
    setResultText('');
  };

  const chooseActivityOption = (choiceId) => {
    if (!activity) return;
    const choice = activity.choices.find((c) => c.id === choiceId);
    if (!choice) return;
    applyDelta(choice.delta);
    setLastChoiceId(choiceId);
    setResultText(choice.result);
    setStep('result');
  };

  return (
    <div className={rcStyles.container}>
      <div className={rcStyles.header}>
        <div className={rcStyles.headerLeft}>
          <h1 className={rcStyles.mainTitle}>Outside Domestic Activities</h1>
          <p className={rcStyles.headerSubtitle}>
            Everyday tasks that still count as movement. Pick what fits your day, then choose how big you want it to be.
          </p>
          <div className={rcStyles.scenePill}>{SCENE_PILLS[step]}</div>
        </div>

        <div className="flex items-center gap-2">
          <button className={rcStyles.secondaryButton} onClick={() => navigate('/')}>
            Main Menu
          </button>
          <button className={rcStyles.secondaryButton} onClick={() => navigate('/domestic-home')}>
            Back
          </button>
          <button className={rcStyles.resetButton} onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      <div className={rcStyles.topRow}>
        <StatsPanel stats={stats} />
      </div>

      <div className={rcStyles.sceneImageWrap}>
        <img
          src={sceneImageSrc}
          alt=""
          className={rcStyles.sceneImage}
        />
        <div className="px-3 py-2 border-t border-indigo-100 bg-white/70 text-center text-sm font-semibold text-slate-800">
          {activity ? `${activity.icon} ${activity.title}` : 'Around the home'}
        </div>
      </div>

      {step === 'intro' && (
        <div className={rcStyles.section}>
          <h2 className={rcStyles.title}>Pick an outside activity</h2>
          <p className={rcStyles.paragraph}>
            You can keep it small and get a quick win, or do a bigger version and feel the progress.
          </p>
          <ActionPanel
            actions={ACTIVITIES.map((a) => ({
              id: a.id,
              icon: a.icon,
              label: a.title,
              action: () => startActivity(a.id),
            }))}
          />
        </div>
      )}

      {step === 'activityIntro' && activity && (
        <div className={rcStyles.section}>
          <h2 className={rcStyles.title}>{activity.title}</h2>
          <p className={rcStyles.paragraph}>{activity.intro}</p>
          <ActionPanel
            actions={[
              {
                id: `${activity.id}-continue`,
                className: rcStyles.primaryButton,
                label: 'Continue',
                action: () => setStep('activityChoice'),
              },
              {
                id: `${activity.id}-intro-back`,
                className: rcStyles.secondaryButton,
                label: 'Back to activities',
                action: backToActivities,
              },
            ]}
          />
        </div>
      )}

      {step === 'activityChoice' && activity && (
        <div className={rcStyles.section}>
          <h2 className={rcStyles.title}>How do you want to do it?</h2>
          <p className={rcStyles.paragraph}>
            Pick the version that matches your energy today.
          </p>
          <ActionPanel
            actions={[
              ...activity.choices.map((c) => ({
                id: `${activity.id}-${c.id}`,
                label: c.label,
                action: () => chooseActivityOption(c.id),
              })),
              {
                id: `${activity.id}-choice-back`,
                className: rcStyles.secondaryButton,
                label: 'Back to activities',
                action: backToActivities,
              },
            ]}
          />
        </div>
      )}

      {step === 'result' && (
        <div className={rcStyles.section}>
          <h2 className={rcStyles.title}>How it went</h2>
          <p className={rcStyles.paragraph}>{resultText}</p>
          <ActionPanel
            actions={[
              {
                id: 'result-back',
                className: rcStyles.primaryButton,
                label: 'Back to activities',
                action: backToActivities,
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}

