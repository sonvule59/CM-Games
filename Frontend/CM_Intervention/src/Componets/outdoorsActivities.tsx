import React, { useState } from 'react';
import { href, useNavigate } from 'react-router';
import { ActionPanel, SecondaryActionPanel } from "./ActionPanel.tsx";
import { statsUpdate, StatsPanel, StatDelta } from "./StatsPanel.tsx";
import pullingUpLakeImg from '../images/pullingUpLake.png';
import walkingLakeImg from '../images/walkingLake.png';
import guyFishingImg from '../images/guyFishing.png';
import catchFishImg from '../images/catchFish.png';
import golfingImg from '../images/golfing.png';
import bocceBallImg from '../images/bocceBall.png';
import {
  BackButton,
  Container,
  Header,
  HeaderLeft,
  HeaderSubtitle,
  MainTitle,
  Paragraph,
  Section,
  Title,
  TopRow,
} from "./Layout.tsx";
import ActivityImage from "./ActivityImage.tsx";

/**
 * OutdoorsActivities: a simple, choice-based mini‑game set at a lakeside park.
 * Start by "pulling up to the lake", then choose an activity (walk, fish, golf, bocce),
 * and explore two small follow‑up situations for each one.
 */
export default function OutdoorsActivities() {
  const navigate = useNavigate();

  // Baseline stats for a "fresh run" of the lake scenario.
  const initialStats = {
    confidence: 50,
    mood: 50,
    health: 50,
    energy: 100,
  };

<<<<<<< HEAD:Frontend/CM_Intervention/src/Componets/outdoorsActivities.jsx
  // Small state machine driving the narrative flow for the chosen activity.
  const [activity, setActivity] = useState(null); // 'walk' | 'fish' | 'golf' | 'bocce' | null
  const [step, setStep] = useState('intro'); // 'intro' | 'activityIntro' | 'activityChoice' | 'result'
=======
  const [activity, setActivity] = useState<
    "walk" | "fish" | "golf" | "bocce" | null
  >(null);
  const [step, setStep] = useState<
    "intro" | "activityIntro" | "activityChoice" | "result"
  >("intro");
>>>>>>> a471bbceddf6ad244641478eaac7a526a5c297e5:Frontend/CM_Intervention/src/Componets/outdoorsActivities.tsx
  const [resultText, setResultText] = useState('');
  const [stats, setStats] = useState(initialStats);

  // Image assets used by the shared `ActivityImage` component.
  const OUTDOOR_IMAGES = {
    lake: pullingUpLakeImg,
    walk: walkingLakeImg,
    fish: guyFishingImg,
    catchFish: catchFishImg,
    golf: golfingImg,
    bocce: bocceBallImg,
  };

  const handleSelectActivity = (
    nextActivity: "walk" | "fish" | "golf" | "bocce",
  ) => {
    setActivity(nextActivity);
    setStep("activityIntro");
    setResultText("");
    if (nextActivity === "walk") {
      applyDelta({ confidence: +2, mood: +3, health: +4, energy: -2 });
    } else if (nextActivity === "fish") {
      applyDelta({ confidence: +2, mood: +4, health: +1, energy: -1 });
    } else if (nextActivity === "golf") {
      applyDelta({ confidence: +4, mood: +2, health: +2, energy: -3 });
    } else if (nextActivity === "bocce") {
      applyDelta({ confidence: +3, mood: +5, health: +2, energy: -2 });
    }
  };

  const applyDelta = (delta: StatDelta) => {
    setStats((prev) =>
      statsUpdate(prev, {
        confidence: delta.confidence ?? 0,
        mood: delta.mood ?? 0,
        health: delta.health ?? 0,
        energy: delta.energy ?? 0,
      }),
    );
  };

  const backToLake = () => {
    setActivity(null);
    setStep('intro');
    setResultText('');
    setStats(initialStats);
  };

  const goToChoices = () => {
    setStep('activityChoice');
  };

  const handleFishingChoice = (choice: "catch" | "back") => {
    if (choice === "catch") {
      applyDelta({ confidence: +8, mood: +5, health: +2, energy: -5 });
      setResultText(
        "You cast your line and feel a steady tug. After a quiet moment of waiting, you reel in a fish and take a second to enjoy the view before deciding what comes next.",
      );
    } else if (choice === "back") {
      applyDelta({ confidence: +2, mood: +4, health: +1, energy: +2 });
      setResultText(
        "You enjoy the gentle sounds of the water for a bit, then decide to head back to the shoreline, feeling relaxed and ready for the rest of the day.",
      );
    }
    setStep("result");
  };

  // You can adjust these later if you want different situations.
  const handleWalkChoice = (choice: "short" | "long") => {
    if (choice === "short") {
      applyDelta({ confidence: +3, mood: +5, health: +4, energy: -2 });
      setResultText(
        "You choose a shorter loop along the water, noticing birds, trees, and the way the light hits the lake. It feels like just enough movement to clear your head.",
      );
    } else if (choice === "long") {
      applyDelta({ confidence: +5, mood: +6, health: +8, energy: -6 });
      setResultText(
        "You follow a longer trail that winds through the trees. You take your time, stop for a few photos, and return feeling refreshed and grounded.",
      );
    }
    setStep("result");
  };

  const handleGolfChoice = (choice: "drives" | "shortGame") => {
    if (choice === "drives") {
      applyDelta({ confidence: +6, mood: +3, health: +2, energy: -5 });
      setResultText(
        "You focus on easy, smooth swings at the driving range. Instead of chasing perfection, you enjoy the rhythm of each shot and the wide‑open sky.",
      );
    } else if (choice === "shortGame") {
      applyDelta({ confidence: +4, mood: +4, health: +1, energy: -3 });
      setResultText(
        "You practice gentle putts and chips on the green. The slower pace lets you notice small improvements and enjoy being outside.",
      );
    }
    setStep("result");
  };

  const handleBocceChoice = (choice: "casual" | "tournament") => {
    if (choice === "casual") {
      applyDelta({ confidence: +4, mood: +7, health: +2, energy: -2 });
      setResultText(
        "You play a relaxed round of bocce with friends, laughing at wild throws and cheering for close shots. The game becomes more about connection than keeping score.",
      );
    } else if (choice === "tournament") {
      applyDelta({ confidence: +6, mood: +6, health: +3, energy: -4 });
      setResultText(
        "You set up a friendly mini‑tournament, taking turns and celebrating each win with high‑fives. The light competition adds excitement without pressure.",
      );
    }
    setStep("result");
  };

  // Render helpers for each step; kept separate to keep the main return readable.
  const renderIntro = () => (
    <Section>
      <Title>Pulling Up to the Lake</Title>
      <Paragraph>
        Looking around, you notice a few options that all sound appealing.
        There&apos;s a trail that winds around the shoreline, people fishing
        quietly from a dock, a small golf area, and a spot set up for bocce
        ball.
      </Paragraph>
      <Paragraph>
        There&apos;s no right or wrong choice here&mdash;just pick what feels
        interesting for you today.
      </Paragraph>
      <ActionPanel
        actions={[
          {
            id: "act-walk",
            label: "Walk a lakeside trail",
            action: () => handleSelectActivity("walk"),
          },
          {
            id: "act-fish",
            label: "Fish at the lake",
            action: () => handleSelectActivity("fish"),
          },
          {
            id: "act-golf",
            label: "Play a little golf",
            action: () => handleSelectActivity("golf"),
          },
          {
            id: "act-bocce",
            label: "Play bocce ball",
            action: () => handleSelectActivity("bocce"),
          },
        ]}
      />
    </Section>
  );

  const renderActivityIntro = () => {
    if (!activity) return null;

    let title = '';
    let body = '';

    if (activity === 'fish') {
      title = 'Settling in to Fish';
      body =
        'You walk down to the dock, set up your gear, and watch the ripples on the surface of the water. You have time to decide how you want this moment to feel.';
    } else if (activity === 'walk') {
      title = 'Starting Your Walk';
      body =
        'You step onto the trail and feel the ground under your feet. The path curves gently along the lake, with quiet spots to pause and look around.';
    } else if (activity === 'golf') {
      title = 'Heading to the Golf Area';
      body =
        'You make your way to the practice area, spotting a few open spots to hit some balls and maybe work on a part of your game that sounds fun today.';
    } else if (activity === 'bocce') {
      title = 'Setting Up Bocce';
      body =
        'You walk over to the bocce court, noticing the smooth ground and open space. It feels like a good place for a relaxed, playful game.';
    }

    return (
      <Section>
        <Title>{title}</Title>
        <Paragraph>{body}</Paragraph>
        <SecondaryActionPanel
          actions={[
            {
              id: "intro-continue",
              isPrimary: true,
              label: "Continue",
              action: goToChoices,
            },
            {
              id: "intro-back",
              isPrimary: false,
              label: "Back to the lake options",
              action: backToLake,
            },
          ]}
        />
      </Section>
    );
  };

  const renderActivityChoices = () => {
    if (!activity) return null;

    if (activity === 'fish') {
      return (
        <Section>
          <Title>How do you want to fish?</Title>
          <Paragraph>
            You have your line ready and the water is calm. You can lean into
            the moment or keep it brief, depending on what feels best.
          </Paragraph>
          <ActionPanel
            actions={[
              {
                id: "fish-catch",
                label: "Try to catch a fish",
                action: () => handleFishingChoice("catch"),
              },
              {
                id: "fish-back",
                label: "Sit for a bit, then head back",
                action: () => handleFishingChoice("back"),
              },
            ]}
          />
        </Section>
      );
    }

    if (activity === 'walk') {
      return (
        <Section>
          <Title>Choosing your walk</Title>
          <Paragraph>
            You look down the shoreline and see paths of different lengths. Both
            options can be a good fit&mdash;it just depends on what your body is
            asking for today.
          </Paragraph>
          <ActionPanel
            actions={[
              {
                id: "walk-short",
                label: "Take a shorter, slower loop",
                action: () => handleWalkChoice("short"),
              },
              {
                id: "walk-long",
                label: "Explore a longer trail",
                action: () => handleWalkChoice("long"),
              },
            ]}
          />
        </Section>
      );
    }

    if (activity === 'golf') {
      return (
        <Section>
          <Title>How do you want to play?</Title>
          <Paragraph>
            You have access to a simple practice area. You can keep things light
            and playful while focusing on one part of your swing.
          </Paragraph>
          <ActionPanel
            actions={[
              {
                id: "golf-drives",
                label: "Hit some easy drives",
                action: () => handleGolfChoice("drives"),
              },
              {
                id: "golf-short",
                label: "Practice your short game",
                action: () => handleGolfChoice("shortGame"),
              },
            ]}
          />
        </Section>
      );
    }

    if (activity === 'bocce') {
      return (
        <Section>
          <Title>Setting the vibe for bocce</Title>
          <Paragraph>
            You&apos;ve got the court, the balls, and some people who are up for
            a game. You can keep it as relaxed or as structured as you want.
          </Paragraph>
          <ActionPanel
            actions={[
              {
                id: "bocce-casual",
                label: "Play a casual, low‑key game",
                action: () => handleBocceChoice("casual"),
              },
              {
                id: "bocce-tourney",
                label: "Make a tiny, friendly tournament",
                action: () => handleBocceChoice("tournament"),
              },
            ]}
          />
        </Section>
      );
    }

    return null;
  };

  const renderResult = () => (
    <Section>
      <Title>How it plays out</Title>
      <Paragraph>{resultText}</Paragraph>
      <SecondaryActionPanel
        actions={[
          {
            id: "result-back",
            isPrimary: false,
            label: "Back to the lake options",
            action: backToLake,
          },
        ]}
      />
    </Section>
  );

<<<<<<< HEAD:Frontend/CM_Intervention/src/Componets/outdoorsActivities.jsx
  // Map current step/activity to a single image key for the top illustration.
  let imageKey = 'lake';
=======
  let imageKey: keyof typeof OUTDOOR_IMAGES = "lake";
>>>>>>> a471bbceddf6ad244641478eaac7a526a5c297e5:Frontend/CM_Intervention/src/Componets/outdoorsActivities.tsx
  if (activity === 'walk') {
    imageKey = 'walk';
  } else if (activity === 'fish') {
    imageKey = step === 'result' ? 'catchFish' : 'fish';
  } else if (activity === 'golf') {
    imageKey = 'golf';
  } else if (activity === 'bocce') {
    imageKey = 'bocce';
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <MainTitle>Day at the Lake</MainTitle>
          <HeaderSubtitle>
            Choose how you&apos;d like to spend time outdoors&mdash;each path
            gives you a slightly different way to enjoy the day.
          </HeaderSubtitle>
        </HeaderLeft>
        <BackButton onClick={() => navigate(href("/"))}>Back to Home</BackButton>
      </Header>

      <ActivityImage src={OUTDOOR_IMAGES[imageKey]} />

      <TopRow>
        <StatsPanel stats={stats} />
      </TopRow>

      {step === "intro" && renderIntro()}
      {step === "activityIntro" && renderActivityIntro()}
      {step === "activityChoice" && renderActivityChoices()}
      {step === "result" && renderResult()}
    </Container>
  );
}

