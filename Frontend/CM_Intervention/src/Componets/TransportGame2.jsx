import React, { useState } from "react";
import { rcStyles } from "../Static/rockClimbingStyles";
import { useNavigate } from "react-router";
import transport2homeImg from "../images/transport2home.png";
import pedometerImg from "../images/pedometer.png";
import parkingImg from "../images/transport2parking.png";
import cartorhandsImg from "../images/cartorhands.png";
import handcompleteImg from "../images/handcomplete.png";
import cartcompleteImg from "../images/cartcomplete.png";
import longorshortImg from "../images/longorshort.png";
import longcompleteImg from "../images/longcomplete.png";
import shortcompleteImg from "../images/shortcomplete.png";


export default function TransportGame2() {
  const initialStats = {
    energy: 100,
    confidence: 50,
    mood: 50,
    health: 50
  };

  const [stats, setStats] = useState(initialStats);
  const [scene, setScene] = useState("home");
  const [step, setStep] = useState(0); 
  const [resultText, setResultText] = useState("");
  const [lastDelta, setLastDelta] = useState({ energy: 0, confidence: 0, mood: 0, health: 0 });
  const [totalDelta, setTotalDelta] = useState({ energy: 0, confidence: 0, mood: 0, health: 0 }); //added to track the total stat changes, not the recent changes
  
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
      health: clamp(prev.health + (delta.health || 0))
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
        applyDelta({ health: +5, energy: -5, mood: +5, confidence: +5 })
        setScene("pedometer");
        setCurrentImage(pedometerImg);
    } else {
        setMethod("car");
        applyDelta({ health: +1, energy: -2, mood: +2, confidence: +1 })
        setScene("parking");
        setCurrentImage(parkingImg);
    }
  }

  const handleAppChoice = (use) => {
    setUseApp(use);
    if (use) {
        applyDelta({ health: +1, energy: -1, mood: +4, confidence: +5 })
    }
    setScene("grocery")
    setCurrentImage(longorshortImg);
  }

  const handleCarryChoice = (choice) => {
    if (choice === "hand") {
        applyDelta({ health: +4, energy: -7, mood: +4, confidence: +7 })
        setResultText("You carried the heavy bags to the car. Your muscles feel worked!");
        setCurrentImage(handcompleteImg);
    } else {
        applyDelta({ health: +2, energy: -2, mood: +3, confidence: +2 })
        setResultText("You used a cart. It was easy, but you missed a strength workout.");
        setCurrentImage(cartcompleteImg);
    }
    setStep(2);
  }
  
  const handleRouteChoice = (choice) => {
    if (choice === "long") {
        applyDelta({ health: +5, energy: -6, mood: +5, confidence: +6 })
        setResultText("You took the scenic long route home.");
        setCurrentImage(longcompleteImg);
    } else {
        applyDelta({ health: +3, energy: -4, mood: +4, confidence: +4 })
        setResultText("You took the shortcut.");
        setCurrentImage(shortcompleteImg);
    }
    setStep(2);
  }

  const handleParkingChoice = (choice) => {
    if (choice === "close") {
      applyDelta({ energy: -3, confidence: +1, mood: +3, health: +1 });
      setResultText(
        "You found a parking spot close to the market. It saved your energy, but you missed a chance to stretch your legs."
      ); 
    } else if (choice === "far") {
      applyDelta({ energy: -6, confidence: +5, mood: +4, health: +5 });
      setResultText("You parked far away and enjoyed a nice walk to the entrance.");
    }
    setScene("grocery");
    setCurrentImage(cartorhandsImg);
  };

  const renderStatsBar = (label, value, color, isPrimary = false) => (
    <div className={isPrimary ? rcStyles.statRowPrimary : rcStyles.statRow}>
      <div className={isPrimary ? rcStyles.statLabelPrimary : rcStyles.statLabel}>{label}</div>
      <div className={isPrimary ? rcStyles.barOuterPrimary : rcStyles.barOuter}>
        <div className={rcStyles.barInner} style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <div className={isPrimary ? rcStyles.statValuePrimary : rcStyles.statValue}>{value}</div>
    </div>
  );

  const renderDeltaList = (deltaData) => {
    const items = [];
    const labels = { confidence: 'Confidence', mood: 'Mood', health: 'Health', energy: 'Energy' };
    Object.keys(deltaData).forEach((key) => {
      const value = deltaData[key];
      if (value === 0) return;
      const sign = value > 0 ? '+' : '';
      items.push(<li key={key} className={rcStyles.deltaItem}>{sign}{value} {labels[key]}</li>);
    });
    return items.length > 0 ? items : <li className={rcStyles.deltaItem}>No recent changes.</li>;
  };

  const renderSceneContent = () => {
    if (step === 2) {
      return (
        <div className={rcStyles.section}>
          <h2 className={rcStyles.title}>Grocery Shopping Complete</h2>
          <p className={rcStyles.paragraph}>{resultText}</p>
          <div className={rcStyles.deltaContainer}>
            <h3 className={rcStyles.subtitle}>Total Changes</h3>
            <ul className={rcStyles.deltaList}>{renderDeltaList(totalDelta)}</ul>
          </div>

          <button onClick={() => navigate("/transport")} className={rcStyles.primaryButton}>
            Go to the other transport game
          </button>
        </div>
      );
    }

    if (scene === "home") {
      return (
        <div className={rcStyles.section}>
          <h2 className={rcStyles.title}>Time to Buy Groceries</h2>
          <p className={rcStyles.paragraph}>
            The store is about 15 minutes away. How will you get there?
          </p>
          <div className={rcStyles.buttonGroup}>
            <button className={rcStyles.button} onClick={() => handleStartChoice("walk")}>Walk to the store</button>
            <button className={rcStyles.button} onClick={() => handleStartChoice("car")}>Drive the car</button>
          </div>
        </div>
      );
    }

    if (scene === "pedometer") {
      return (
        <div className={rcStyles.section}>
          <h2 className={rcStyles.title}>Step Tracker</h2>
          <p className={rcStyles.paragraph}>
            Will you turn on your pedometer app to track your goal?
          </p>
          <div className={rcStyles.buttonGroup}>
            <button className={rcStyles.button} onClick={() => handleAppChoice(true)}>Turn on Pedometer App</button>
            <button className={rcStyles.button} onClick={() => handleAppChoice(false)}>Just walk without tracking</button>
          </div>
        </div>
      );
    }

    if (scene === "parking") {
      return (
        <div className={rcStyles.section}>
          <h2 className={rcStyles.title}>Grocery Parking</h2>
          <p className={rcStyles.paragraph}>The entrance is crowded. Where will you park?</p>
          <div className={rcStyles.buttonGroup}>
            <button className={rcStyles.button} onClick={() => handleParkingChoice("far")}>Park Far Away</button>
            <button className={rcStyles.button} onClick={() => handleParkingChoice("close")}>Park Near Entrance</button>
          </div>
        </div>
      );
    }

    if (scene === "grocery") {
      return (
        <div className={rcStyles.section}>
          <h2 className={rcStyles.title}>Shopping Finished!</h2>
          {method === "car" ? (
            <>
              <p className={rcStyles.paragraph}>You have 3 heavy bags. How will you get them to your car?</p>
              <div className={rcStyles.buttonGroup}>
                <button className={rcStyles.button} onClick={() => handleCarryChoice("hand")}>Carry by hand (Carrying Groceries)</button>
                <button className={rcStyles.button} onClick={() => handleCarryChoice("cart")}>Use a shopping cart</button>
              </div>
            </>
          ) : (
            <>
              <p className={rcStyles.paragraph}>Heading home. Which way will you take?</p>
              <div className={rcStyles.buttonGroup}>
                <button className={rcStyles.button} onClick={() => handleRouteChoice("long")}>Take the longer scenic route</button>
                <button className={rcStyles.button} onClick={() => handleRouteChoice("short")}>Take the usual shortcut</button>
              </div>
            </>
          )}
        </div>
      );
    }

  };

  return (
    <div className={rcStyles.container}>
      <div className={rcStyles.header}>
        <div className={rcStyles.headerLeft}>
          <h1 className={rcStyles.mainTitle}>
            {scene === "home" ? "Daily Transport" : "Grocery Shopping"}
          </h1>
          <p className={rcStyles.headerSubtitle}>Every small movement counts toward your daily health.</p>
          <div className={rcStyles.scenePill}>
            {step === 0 && "Planning"}
            {step === 1 && "On the Move"}
            {step === 2 && "Mission Complete"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className={rcStyles.resetButton} onClick={resetGame}>Reset</button>
        </div>
      </div>

      <div className={rcStyles.topRow}>
        <div className={rcStyles.statsContainer}>
          <div className={rcStyles.statsTitle}>How you're feeling</div>
          {renderStatsBar('Confidence', stats.confidence, '#ef4444', true)}
          {renderStatsBar('Mood', stats.mood, '#22c55e')}
          {renderStatsBar('Health', stats.health, '#3b82f6')}
          {renderStatsBar('Energy', stats.energy, '#facc15')}
        </div>
      </div>

      <div className={rcStyles.sceneImageWrap}>
        <img
          src={currentImage}
          alt="Current Scene"
          className={rcStyles.sceneImage}
        />
      </div>

      {renderSceneContent()}
    </div>
  );
}