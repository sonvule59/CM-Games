import React, { useState } from "react";
import parkingLotImg from "../images/parkingLot.png";
import walkingImg from "../images/walkingLot.png";
import fastWalkImg from "../images/walkingFast.png";
import parkedImg from "../images/parked.png";
import parkedCloseImg from "../images/parkedClose.png";
import { href, useNavigate } from "react-router";
import {
  Container,
  Header,
  HeaderLeft,
  HeaderRight,
  HeaderSubtitle,
  MainTitle,
  Paragraph,
  PrimaryButton,
  ResetButton,
  BackButton,
  ScenePill,
  Section,
  Title,
  TopRow,
} from "./Layout.tsx";
import { StatDelta, StatDeltaViewer, StatsPanel } from "./StatsPanel";
import ActivityImage from "./ActivityImage";
import { ActionPanel } from "./ActionPanel";


export default function ParkingLot() {
  const initialStats = {
    energy: 50,
    confidence: 50,
    mood: 50,
    health: 50
  };

  const [stats, setStats] = useState(initialStats);
  const [scene, setScene] = useState<"walking" | "parking">("parking");
  const [step, setStep] = useState(0); 
  const [resultText, setResultText] = useState("");
  const [lastDelta, setLastDelta] = useState({ energy: 0, confidence: 0, mood: 0, health: 0 });
  
  const [currentImage, setCurrentImage] = useState(parkingLotImg);
  // @Kelly added navigate 
  const navigate = useNavigate();

  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const applyDelta = (delta: StatDelta) => {
    setStats((prev) => ({
      energy: clamp(prev.energy + (delta.energy || 0)),
      confidence: clamp(prev.confidence + (delta.confidence || 0)),
      mood: clamp(prev.mood + (delta.mood || 0)),
      health: clamp(prev.health + (delta.health || 0)),
    }));
    setLastDelta({
      energy: delta.energy || 0,
      confidence: delta.confidence || 0,
      mood: delta.mood || 0,
      health: delta.health || 0,
    });
  };

  // const resetGame = () => {
  //   setStats(initialStats);
  //   setScene("parking");
  //   setStep(0);
  //   setResultText("");
  //   setLastDelta({ energy: 0, confidence: 0, mood: 0, health: 0 });            commented out as the reset button was removed.
  //   setCurrentImage(parkingLotImg);
  // };

  const handleParkingChoice = (choice: "close" | "far") => {
    if (choice === "close") {
      applyDelta({ energy: +2, confidence: +1, mood: +3, health: +1 });
      setResultText(
        "You found a parking spot close to the building. It saved your energy, but you missed a chance to stretch your legs.",
      );
      setCurrentImage(parkedCloseImg);
      setStep(2);
    } else if (choice === "far") {
      applyDelta({ energy: +4, confidence: +6, mood: +5, health: +6 });
      setCurrentImage(parkedImg);
      setScene("walking");
      setStep(1);
    }
  };

  const handleWalkingChoice = (choice: "normal" | "fast") => {
    if (choice === "normal") {
      applyDelta({ energy: +2, confidence: +4, mood: +3, health: +4 });
      setResultText(
        "You walked toward the building at a relaxed pace. The short walk helped you settle into the day.",
      );
      setCurrentImage(walkingImg);
    } else if (choice === "fast") {
      applyDelta({ energy: +4, mood: +5, health: +8, confidence: +8 });
      setResultText(
        "You decided to walk faster. Your body feels more awake and energized before entering the building.",
      );
      setCurrentImage(fastWalkImg);
    }
    setStep(2);
  };

  const renderSceneContent = () => {
    if (scene === "parking" && step === 0) {
      return (
        <Section>
          <Title>Arriving at the Parking Lot</Title>
          <Paragraph>
            You arrive at the parking lot. Some spots are close to the entrance,
            while others are farther away. How will you start your morning?
          </Paragraph>
          <ActionPanel
            actions={[
              {
                key: "park-close",
                label: <>Park close to the building</>,
                onClick() {
                  handleParkingChoice("close");
                },
              },
              {
                key: "park-far",
                label: <>Park farther away and walk</>,
                onClick() {
                  handleParkingChoice("far");
                },
              },
            ]}
          />
        </Section>
      );
    }

    if (scene === "walking" && step === 1) {
      return (
        <Section>
          <Title>Walking to the Office</Title>
          <Paragraph>
            You've parked a bit further away. Now, how would you like to walk to
            the entrance?
          </Paragraph>
          <StatDeltaViewer delta={lastDelta} />
          <ActionPanel
            actions={[
              {
                key: "walk-normal",
                onClick() {
                  handleWalkingChoice("normal");
                },
                label: <>Walk at a relaxed pace</>,
              },
              {
                key: "walk-fast",
                onClick() {
                  handleWalkingChoice("fast");
                },
                label: <>Walk faster to wake up</>,
              },
            ]}
          />
        </Section>
      );
    }

    if (step === 2) {
      return (
        <Section>
          <Title>Morning Arrival Complete</Title>
          <Paragraph>{resultText}</Paragraph>
          <StatDeltaViewer delta={lastDelta} />
          <PrimaryButton onClick={() => navigate(href("/office/test"))}>
            Go into the office
          </PrimaryButton>
        </Section>
      );
    }
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <MainTitle>Parking Lot Arrival</MainTitle>
          <HeaderSubtitle>
            Every small movement counts toward your daily health.
          </HeaderSubtitle>
          <ScenePill>
            {step === 0
              ? "Initial Choice"
              : step === 1
                ? "Commute in Progress"
                : "Arrived"}
          </ScenePill>
        </HeaderLeft>
        <HeaderRight>
          <BackButton onClick={() => navigate(href("/office"))} />
          {/* <ResetButton onClick={resetGame} /> */}
        </HeaderRight>
      </Header>

      <TopRow>
        <StatsPanel stats={stats} />
      </TopRow>

      <ActivityImage src={currentImage} />

      {renderSceneContent()}
    </Container>
  );
}