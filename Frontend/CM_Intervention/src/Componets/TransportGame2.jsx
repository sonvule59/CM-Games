import React, { useState } from "react";
import { href, useNavigate } from "react-router";
import transport2homeImg from "../images/transport2home.png";
import pedometerImg from "../images/pedometer.png";
import parkingImg from "../images/transport2parking.png";
import cartorhandsImg from "../images/cartorhands.png";
import handcompleteImg from "../images/handcomplete.png";
import cartcompleteImg from "../images/cartcomplete.png";
import longorshortImg from "../images/longorshort.png";
import longcompleteImg from "../images/longcomplete.png";
import shortcompleteImg from "../images/shortcomplete.png";
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
  ScenePill,
  Section,
  Title,
  TopRow,
} from "./Layout";
import { StatDeltaViewer, StatsPanel } from "./StatsPanel";
import { ActionPanel } from "./ActionPanel";
import ActivityImage from "./ActivityImage";

export default function TransportGame2() {
  const initialStats = {
    energy: 100,
    confidence: 50,
    mood: 50,
    health: 50,
  };

  const [stats, setStats] = useState(initialStats);
  const [scene, setScene] = useState("home");
  const [step, setStep] = useState(0);
  const [resultText, setResultText] = useState("");
  const [lastDelta, setLastDelta] = useState({
    energy: 0,
    confidence: 0,
    mood: 0,
    health: 0,
  });
  const [totalDelta, setTotalDelta] = useState({
    energy: 0,
    confidence: 0,
    mood: 0,
    health: 0,
  }); //added to track the total stat changes, not the recent changes

  const [currentImage, setCurrentImage] = useState(transport2homeImg);

  const [method, setMethod] = useState("");
  const [useApp, setUseApp] = useState(false);

  const navigate = useNavigate();

  const clamp = (v) => Math.max(0, Math.min(100, v));

  const applyDelta = (delta) => {
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
    //total stat change update
    setTotalDelta((prev) => ({
      energy: prev.energy + (delta.energy || 0),
      confidence: prev.confidence + (delta.confidence || 0),
      mood: prev.mood + (delta.mood || 0),
      health: prev.health + (delta.health || 0),
    }));
  };

  const resetGame = () => {
    setStats(initialStats);
    setScene("home");
    setStep(0);
    setMethod("");
    setUseApp(false);
    setResultText("");
    setLastDelta({ energy: 0, confidence: 0, mood: 0, health: 0 });
    setCurrentImage(transport2homeImg);
    setTotalDelta({ energy: 0, confidence: 0, mood: 0, health: 0 });
  };

  const handleStartChoice = (choice) => {
    if (choice === "walk") {
      setMethod("walk");
      applyDelta({ health: +5, energy: -5, mood: +5, confidence: +5 });
      setScene("pedometer");
      setCurrentImage(pedometerImg);
    } else {
      setMethod("car");
      applyDelta({ health: +1, energy: -2, mood: +2, confidence: +1 });
      setScene("parking");
      setCurrentImage(parkingImg);
    }
  };

  const handleAppChoice = (use) => {
    setUseApp(use);
    if (use) {
      applyDelta({ health: +1, energy: -1, mood: +4, confidence: +5 });
    }
    setScene("grocery");
    setCurrentImage(longorshortImg);
  };

  const handleCarryChoice = (choice) => {
    if (choice === "hand") {
      applyDelta({ health: +4, energy: -7, mood: +4, confidence: +7 });
      setResultText(
        "You carried the heavy bags to the car. Your muscles feel worked!",
      );
      setCurrentImage(handcompleteImg);
    } else {
      applyDelta({ health: +2, energy: -2, mood: +3, confidence: +2 });
      setResultText(
        "You used a cart. It was easy, but you missed a strength workout.",
      );
      setCurrentImage(cartcompleteImg);
    }
    setStep(2);
  };

  const handleRouteChoice = (choice) => {
    if (choice === "long") {
      applyDelta({ health: +5, energy: -6, mood: +5, confidence: +6 });
      setResultText("You took the scenic long route home.");
      setCurrentImage(longcompleteImg);
    } else {
      applyDelta({ health: +3, energy: -4, mood: +4, confidence: +4 });
      setResultText("You took the shortcut.");
      setCurrentImage(shortcompleteImg);
    }
    setStep(2);
  };

  const handleParkingChoice = (choice) => {
    if (choice === "close") {
      applyDelta({ energy: -3, confidence: +1, mood: +3, health: +1 });
      setResultText(
        "You found a parking spot close to the market. It saved your energy, but you missed a chance to stretch your legs.",
      );
    } else if (choice === "far") {
      applyDelta({ energy: -6, confidence: +5, mood: +4, health: +5 });
      setResultText(
        "You parked far away and enjoyed a nice walk to the entrance.",
      );
    }
    setScene("grocery");
    setCurrentImage(cartorhandsImg);
  };

  const renderSceneContent = () => {
    if (step === 2) {
      return (
        <Section>
          <Title>Grocery Shopping Complete</Title>
          <Paragraph>{resultText}</Paragraph>
          <StatDeltaViewer delta={totalDelta} />

          <PrimaryButton onClick={() => navigate(href("/transport"))}>
            Go to the other transport game
          </PrimaryButton>
        </Section>
      );
    }

    if (scene === "home") {
      return (
        <Section>
          <Title>Time to Buy Groceries</Title>
          <Paragraph>
            The store is about 15 minutes away. How will you get there?
          </Paragraph>
          <ActionPanel
            actions={[
              {
                onClick() {
                  handleStartChoice("walk");
                },
                key: "walk",
                label: <>Walk to the store</>,
              },
              {
                onClick() {
                  handleStartChoice("car");
                },
                key: "car",
                label: <>Drive the car</>,
              },
            ]}
          />
        </Section>
      );
    }

    if (scene === "pedometer") {
      return (
        <Section>
          <Title>Step Tracker</Title>
          <Paragraph>
            Will you turn on your pedometer app to track your goal?
          </Paragraph>
          <ActionPanel
            actions={[
              {
                onClick() {
                  handleAppChoice(true);
                },
                key: "true",
                label: <>Turn on Pedometer App</>,
              },
              {
                onClick() {
                  handleAppChoice(false);
                },
                key: "false",
                label: <>Just walk without tracking</>,
              },
            ]}
          />
        </Section>
      );
    }

    if (scene === "parking") {
      return (
        <Section>
          <Title>Grocery Parking</Title>
          <Paragraph>The entrance is crowded. Where will you park?</Paragraph>
          <ActionPanel
            actions={[
              {
                onClick() {
                  handleParkingChoice("far");
                },
                key: "far",
                label: <>Park Far Away</>,
              },
              {
                onClick() {
                  handleParkingChoice("close");
                },
                key: "close",
                label: <>Park Near Entrance</>,
              },
            ]}
          />
        </Section>
      );
    }

    if (scene === "grocery") {
      return (
        <Section>
          <Title>Shopping Finished!</Title>
          {method === "car" ? (
            <>
              <Paragraph>
                You have 3 heavy bags. How will you get them to your car?
              </Paragraph>
              <ActionPanel
                actions={[
                  {
                    onClick() {
                      handleCarryChoice("hand");
                    },
                    key: "hand",
                    label: <>Carry by hand (Carrying Groceries)</>,
                  },
                  {
                    onClick() {
                      handleCarryChoice("cart");
                    },
                    key: "cart",
                    label: <>Use a shopping cart</>,
                  },
                ]}
              />
            </>
          ) : (
            <>
              <Paragraph>Heading home. Which way will you take?</Paragraph>
              <ActionPanel
                actions={[
                  {
                    onClick() {
                      handleRouteChoice("long");
                    },
                    key: "long",
                    label: <>Take the longer scenic route</>,
                  },
                  {
                    onClick() {
                      handleRouteChoice("short");
                    },
                    key: "short",
                    label: <>Take the usual shortcut</>,
                  },
                ]}
              />
            </>
          )}
        </Section>
      );
    }
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <MainTitle>
            {scene === "home" ? "Daily Transport" : "Grocery Shopping"}
          </MainTitle>
          <HeaderSubtitle>
            Every small movement counts toward your daily health.
          </HeaderSubtitle>
          <ScenePill>
            {step === 0 && "Planning"}
            {step === 1 && "On the Move"}
            {step === 2 && "Mission Complete"}
          </ScenePill>
        </HeaderLeft>
        <HeaderRight>
          <ResetButton onClick={resetGame} />
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
