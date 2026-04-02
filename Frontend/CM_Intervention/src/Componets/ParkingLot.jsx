import React, { useState } from "react";
import parkingLotImg from "../images/parkingLot.png";
import walkingImg from "../images/walkingLot.png";
import fastWalkImg from "../images/walkingFast.png";
import parkedImg from "../images/parked.png";
import parkedCloseImg from "../images/parkedClose.png";
import { rcStyles } from "../Static/rockClimbingStyles";
import { useNavigate } from "react-router";


export default function ParkingLot() {
  const initialStats = {
    energy: 100,
    confidence: 50,
    mood: 50,
    health: 50
  };

  const [stats, setStats] = useState(initialStats);
  const [scene, setScene] = useState("parking");
  const [step, setStep] = useState(0); 
  const [resultText, setResultText] = useState("");
  const [lastDelta, setLastDelta] = useState({ energy: 0, confidence: 0, mood: 0, health: 0 });
  
  const [currentImage, setCurrentImage] = useState(parkingLotImg);
  // @Kelly added navigate 
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
  };

  const resetGame = () => {
    setStats(initialStats);
    setScene("parking");
    setStep(0);
    setResultText("");
    setLastDelta({ energy: 0, confidence: 0, mood: 0, health: 0 });
    setCurrentImage(parkingLotImg);
  };

  const handleParkingChoice = (choice) => {
    if (choice === "close") {
      applyDelta({ energy: -3, confidence: +1, mood: +3, health: +1 });
      setResultText(
        "You found a parking spot close to the building. It saved your energy, but you missed a chance to stretch your legs."
      );
      setCurrentImage(parkedCloseImg); 
      setStep(2); 
    } else if (choice === "far") {
      applyDelta({ energy: -7, confidnece: +6, mood: +5, health: +6 });
      setCurrentImage(parkedImg); 
      setScene("walking");
      setStep(1); 
    }
  };

  const handleWalkingChoice = (choice) => {
    if (choice === "normal") {
      applyDelta({ energy: -5, confidence: +4, mood: +3, health: +4 });
      setResultText(
        "You walked toward the building at a relaxed pace. The short walk helped you settle into the day."
      );
      setCurrentImage(walkingImg); 
    } else if (choice === "fast") {
      applyDelta({ energy: -10, mood: +5, health: +8, confidence: +8 });
      setResultText(
        "You decided to walk faster. Your body feels more awake and energized before entering the building."
      );
      setCurrentImage(fastWalkImg); 
    }
    setStep(2); 
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

  const renderDeltaList = () => {
    const items = [];
    const labels = { confidence: 'Confidence', mood: 'Mood', health: 'Health', energy: 'Energy' };
    Object.keys(lastDelta).forEach((key) => {
      const value = lastDelta[key];
      if (!value) return;
      const sign = value > 0 ? '+' : '';
      items.push(<li key={key} className={rcStyles.deltaItem}>{sign}{value} {labels[key]}</li>);
    });
    return items.length > 0 ? items : <li className={rcStyles.deltaItem}>No recent changes.</li>;
  };

  const renderSceneContent = () => {
    if (scene === "parking" && step === 0) {
      return (
        <div className={rcStyles.section}>
          <h2 className={rcStyles.title}>Arriving at the Parking Lot</h2>
          <p className={rcStyles.paragraph}>
            You arrive at the parking lot. Some spots are close to the entrance, while others are farther away.
            How will you start your morning?
          </p>
          <div className={rcStyles.buttonGroup}>
            <button className={rcStyles.button} onClick={() => handleParkingChoice("close")}>
              Park close to the building
            </button>
            <button className={rcStyles.button} onClick={() => handleParkingChoice("far")}>
              Park farther away and walk
            </button>
          </div>
        </div>
      );
    }

    if (scene === "walking" && step === 1) {
      return (
        <div className={rcStyles.section}>
          <h2 className={rcStyles.title}>Walking to the Office</h2>
          <p className={rcStyles.paragraph}>
            You've parked a bit further away. Now, how would you like to walk to the entrance?
          </p>
          <div className={rcStyles.deltaContainer}>
            <h3 className={rcStyles.subtitle}>Stat Changes from Parking</h3>
            <ul className={rcStyles.deltaList}>{renderDeltaList()}</ul>
          </div>
          <div className={rcStyles.buttonGroup}>
            <button className={rcStyles.button} onClick={() => handleWalkingChoice("normal")}>
              Walk at a relaxed pace
            </button>
            <button className={rcStyles.button} onClick={() => handleWalkingChoice("fast")}>
              Walk faster to wake up
            </button>
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className={rcStyles.section}>
          <h2 className={rcStyles.title}>Morning Arrival Complete</h2>
          <p className={rcStyles.paragraph}>{resultText}</p>
          <div className={rcStyles.deltaContainer}>
            <h3 className={rcStyles.subtitle}>Total Changes</h3>
            <ul className={rcStyles.deltaList}>{renderDeltaList()}</ul>
          </div>
          <button onClick={() => navigate("/office/test")} className={rcStyles.primaryButton}>
            Go into the office
          </button>
        </div>
      );
    }
  };

  return (
    <div className={rcStyles.container}>
      <div className={rcStyles.header}>
        <div className={rcStyles.headerLeft}>
          <h1 className={rcStyles.mainTitle}>Parking Lot Arrival</h1>
          <p className={rcStyles.headerSubtitle}>Every small movement counts toward your daily health.</p>
          <div className={rcStyles.scenePill}>
            {step === 0 ? "Initial Choice" : step === 1 ? "Commute in Progress" : "Arrived"}
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