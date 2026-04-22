import { useState } from "react";
import {s} from "../Static/officestyles.js"
import { href, useNavigate } from "react-router";
import {
  Container,
  Header,
  HeaderLeft,
  HeaderSubtitle,
  MainTitle,
  Paragraph,
  ParagraphItalic,
  PrimaryButton,
  ResetButton,
  BackButton,
  ScenePill,
  SecondaryButton,
  Section,
  Title,
  TopRow,
} from "./Layout.js";
import {
  StatDelta,
  StatDeltaViewer,
  StatsPanel,
  statsUpdate,
} from "./StatsPanel.js";
import ActivityImage from "./ActivityImage.js";
import { ActionPanel, SecondaryActionPanel } from "./ActionPanel.js";
const atDeskImg        = "/assets/Images/working.webp";
const legLiftImg       = "/assets/Images/leg_raise.webp";
const standingImg      = "/assets/Images/standing_desk.webp";
const armStretchImg    = "/assets/Images/arm_stretches.webp";
const chairSquatImg    = "/assets/Images/chari_squat.webp";
const walkMeetingImg   = "/assets/Images/walking_meeting.webp";
const waterBreakImg    = "/assets/Images/water_break.webp";
const printerWalkImg   = "/assets/Images/Walking_to_printer.webp";

const SCENE_IMAGES = {
  office:          atDeskImg,
  walk:            atDeskImg,
  leglift:         legLiftImg,
  standing:        standingImg,
  deskexercise:    atDeskImg,
  stretch:         armStretchImg,
  chairsquat:      chairSquatImg,
  wrist:           legLiftImg,
  walkmeeting:     walkMeetingImg,
  waterbreak:      waterBreakImg,
  printer:         printerWalkImg,
};


const INITIAL_STATS = { confidence: 50, mood: 50, health: 50, energy: 100 };
const STAT_KEYS = ["confidence", "mood", "health", "energy"];

const SCENE_LABELS = {
  office:       "At your desk",
  walk:         "On a walk",
  leglift:      "Sneaky desk workout",
  standing:     "Standing desk mode",
  deskexercise: "Desk exercise time!",
};

const WALK_OPTIONS = [
  {
    id: "walkmeeting",
    label: "Walking meeting",
    intro:
      "You grab your phone and suggest taking the call outside. Fresh air, moving feet, still getting things done — best of both worlds.",
    result:
      "Productive and active? That's the dream combo. Your team loved it too. Let's do that again! 🚶📱",
    delta: { energy: -6, mood: +12, confidence: +12, health: +8 },
  },
  {
    id: "waterbreak",
    label: "Water break walk",
    intro:
      "You grab your water bottle and take the long way to the kitchen. Hydration plus movement — your body's two favourite things.",
    result:
      "Hydrated and stretched out. That's a double win. Small detour, big payoff. 💧",
    delta: { energy: -3, mood: +10, confidence: +5, health: +10 },
  },
  {
    id: "printer",
    label: "Walk to the printer",
    intro:
      "You send something to print and take your time getting there. Down the hall, a little loop — every step counts.",
    result:
      "Technically productive, secretly a wellness break. Nobody needs to know. 🖨️",
    delta: { energy: -2, mood: +8, confidence: +4, health: +6 },
  },
] as const;

const DESK_EXERCISE_OPTIONS = [
  {
    id: "stretch",
    label: "Arm & shoulder stretches",
    intro:
      "You extend your arms wide and roll your shoulders back. Tension you didn't even know was there starts to melt away.",
    result:
      "Those stretches just undid an hour of hunching. Your shoulders are officially grateful. 💪",
    delta: { energy: -3, mood: +8, health: +10, confidence: +5 },
  },
  {
    id: "chairsquat",
    label: "Chair squats",
    intro:
      "You stand, lower yourself almost to the seat, then rise. Three reps in and you're already feeling it.",
    result:
      "Chair squats — who knew your desk could double as a gym? Legs activated. You did that! 🙌",
    delta: { energy: -8, mood: +10, health: +12, confidence: +8 },
  },
  {
    id: "wrist",
    label: "Leg raises",
    intro:
      "You lift both legs slowly under the desk, hold for a beat, then lower. Nobody has any idea.",
    result:
      "Sneaky and effective. Core engaged, legs working — all from your chair. Keep it up! ✨",
    delta: { energy: -5, mood: +8, health: +10, confidence: +6 },
  },
] as const;

const TASKS = [
  {
    id: "walk",
    icon: "🚶",
    name: "Take a Walk",
    desc: "Step outside or lap the office",
    scene: "walk",
    delta: () => ({ energy: 0, mood: 0, confidence: 0, health: 0 }),
    intro:
      "You push back from your chair and stand up. Legs? Grateful. Brain? Already less foggy. Where to?",
    result: "",
  },
  {
    id: "standing",
    icon: "🧍",
    name: "Standing Desk",
    desc: "Rise up and keep working",
    scene: "standing",
    delta: () => ({ energy: -1, mood: +10, confidence: +10, health: +5 }),
    intro:
      "You raise the desk with a soft whirr and shift your weight onto your feet. The posture change alone feels like a tiny reset.",
    result:
      "Posture improved, focus sharpened. You're standing tall — literally! 🧍",
  },
  {
    id: "deskexercise",
    icon: "🏋️",
    name: "Desk Exercises",
    desc: "Move without leaving your seat",
    scene: "deskexercise",
    delta: () => ({ energy: 0, mood: 0, confidence: 0, health: 0 }),
    intro:
      "You don't need a gym. You've got a chair, two arms, and two legs — let's use them.",
    result: "",
  },
] as const;

export default function OfficeGame() {
  const navigate = useNavigate();
  const [stats, setStats]           = useState(INITIAL_STATS);
  const [scene, setScene] = useState<keyof typeof SCENE_LABELS>("office");
  const [step, setStep]             = useState(0);
  const [lastDelta, setLastDelta] = useState<StatDelta>({
    energy: 0,
    mood: 0,
    confidence: 0,
    health: 0,
  });
  const [resultText, setResultText] = useState("");
  const [activeTask, setActiveTask] = useState<(typeof TASKS)[number] | null>(
    null,
  );
  const [deskOption, setDeskOption] = useState<
    (typeof DESK_EXERCISE_OPTIONS)[number] | null
  >(null);
  const [walkOption, setWalkOption] = useState<
    (typeof WALK_OPTIONS)[number] | null
  >(null);

  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

  const applyDelta = (delta: StatDelta) => {
    setStats((prev) => statsUpdate(prev, delta));
    setLastDelta({
      energy: delta.energy || 0,
      mood: delta.mood || 0,
      confidence: delta.confidence || 0,
      health: delta.health || 0,
    });
  };

  const handleTaskChoice = (task: (typeof TASKS)[number]) => {
    applyDelta(task.delta());
    setActiveTask(task);
    setScene(task.scene);
    setStep(1);
    setResultText("");
    setDeskOption(null);
    setWalkOption(null);
  };

  const handleConfirm = () => {
    setResultText(activeTask!.result);
    setStep(3);
  };

  const handleWalkOption = (option: (typeof WALK_OPTIONS)[number]) => {
    applyDelta(option.delta);
    setWalkOption(option);
    setResultText(option.result);
    setStep(3);
  };

  const handleDeskOption = (option: (typeof DESK_EXERCISE_OPTIONS)[number]) => {
    applyDelta(option.delta);
    setDeskOption(option);
    setResultText(option.result);
    setStep(3);
  };

  const handleDoMoreDesk = () => {
    setDeskOption(null);
    setResultText("");
    setStep(2);
  };

  const backToOffice = () => {
    setScene("office");
    setStep(0);
    setLastDelta({ energy: 0, mood: 0, confidence: 0, health: 0 });
    setResultText("");
    setActiveTask(null);
    setDeskOption(null);
    setWalkOption(null);
  };

  // const resetGame = () => {
  //   setStats(INITIAL_STATS);      commented out as the reset button was removed.
  //   backToOffice();
  // };

  const renderScene = () => {

    if (scene === "office") {
      return (
        <Section>
          <Title>The Office</Title>
          <Paragraph>
            You've got a moment. What would feel good for your body and mind
            right now?
          </Paragraph>
          <Paragraph>
            Every option counts — choose what fits your energy today.
          </Paragraph>
          <ActionPanel
            actions={TASKS.map((t) => ({
              key: t.id,
              icon: t.icon,
              name: t.name,
              desc: t.desc,
              onClick() {
                handleTaskChoice(t);
              },
            }))}
          />
        </Section>
      );
    }

    if (step === 1 && activeTask) {
      const isDeskEx = activeTask.id === "deskexercise";
      const isWalk   = activeTask.id === "walk";
      return (
        <Section>
          <Title>{activeTask.name}</Title>
          <Paragraph>{activeTask.intro}</Paragraph>
          {!isDeskEx && !isWalk && (
            <Paragraph>No pressure. Any movement is a win.</Paragraph>
          )}
          <StatDeltaViewer subtitle={<>Recent changes</>} delta={lastDelta} />
          <PrimaryButton
            onClick={() => {
              if (isDeskEx || isWalk) setStep(2);
              else handleConfirm();
            }}
          >
            {isWalk ? "Let's go! 🚶" : isDeskEx ? "Let's go! 💪" : "Continue"}
          </PrimaryButton>
        </Section>
      );
    }

    if (step === 2 && activeTask?.id === "walk") {
      return (
        <Section>
          <Title>Where to? 🚶</Title>
          <Paragraph>
            Pick your walk — all three count. Go with what feels right.
          </Paragraph>
          <ActionPanel
            actions={WALK_OPTIONS.map((opt) => ({
              key: opt.id,
              onClick() {
                handleWalkOption(opt);
              },
              label: opt.label,
            }))}
          />
        </Section>
      );
    }

    if (step === 2 && activeTask?.id === "deskexercise") {
      return (
        <Section>
          <Title>Pick your move 🏋️</Title>
          <Paragraph>
            What's calling to you right now? All three are great — pick the one
            that feels right.
          </Paragraph>
          <ActionPanel
            actions={DESK_EXERCISE_OPTIONS.map((opt) => ({
              key: opt.id,
              onClick() {
                handleDeskOption(opt);
              },
              label: opt.label,
            }))}
          />
        </Section>
      );
    }

    if (step === 3) {
      const isDeskEx = activeTask?.id === "deskexercise";
      const isWalk   = activeTask?.id === "walk";
      const activeOption = deskOption || walkOption;

      return (
        <Section>
          <Title>
            {isDeskEx
              ? "Nailed it! 🎉"
              : isWalk
                ? "Nice work! 🚶"
                : "Afterward"}
          </Title>
          {activeOption && (
            <ParagraphItalic>{activeOption.intro}</ParagraphItalic>
          )}
          <Paragraph>{resultText}</Paragraph>
          <StatDeltaViewer subtitle={<>Recent changes</>} delta={lastDelta} />
          <SecondaryActionPanel
            actions={[
              ...(isDeskEx
                ? [
                    {
                      key: "doAnotherExercise",
                      onClick: handleDoMoreDesk,
                      label: <>Do another exercise 💪</>,
                      isPrimary: true,
                    },
                  ]
                : []),
              {
                key: "backToOffice",
                onClick: backToOffice,
                label: <>Back to Desk</>,
                isPrimary: false,
              },
            ]}
          />
        </Section>
      );
    }

    return null;
  };

  const sceneImageKey =
    scene === "deskexercise" && deskOption ? deskOption.id
    : scene === "walk"        && walkOption ? walkOption.id
    : scene;

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <MainTitle>Office Wellness</MainTitle>
          <HeaderSubtitle>
            Small moves, big difference — choose what feels right today.
          </HeaderSubtitle>
          <ScenePill>{SCENE_LABELS[scene]}</ScenePill>
        </HeaderLeft>
        <BackButton onClick={() => navigate(href("/office"))} />
        {/* <ResetButton onClick={resetGame} /> */}
      </Header>

      {/* Stats */}
      <TopRow>
        <StatsPanel stats={stats} />
      </TopRow>

      {/* Scene image */}
      <ActivityImage src={SCENE_IMAGES[sceneImageKey]} />

      {renderScene()}
    </Container>
  );
}