import { s } from "../Static/officestyles.js";
import { href, useNavigate } from "react-router";

/**
 * DomesticGameStart: entry card for "home activities".
 *
 * This screen is hub that routes into the indoor vs
 * outside domestic activity flows. The layout here is intentionally presentational
 * with no game state.
 */
export default function DomesticGameStart() {
  const navigate = useNavigate();
  // Route specs for the two domestic categories.
  const games = /** @type {const} */([
    { path: "/indoor-domestic", text: "Indoor activities",  color: "#10b981" },
    { path: "/outside-domestic",   text: "Around the house",   color: "#6366f1" },
  ]);

  return (
    <div className={s.container} style={{ padding: 0, overflow: "hidden", position: "relative" }}>

      {/* Hero image */}
      <div style={{ position: "relative", width: "100%", height: 340 }}>
        <img
          src="/assets/Images/cleaningWindows.png"
          alt="Home activities"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: 120,
          background: "linear-gradient(to bottom, transparent, #f8fafc)",
        }} />
      </div>

      {/* Card content */}
      <div style={{ padding: "0 28px 32px", marginTop: -16, position: "relative" }}>

        <div style={{ marginBottom: 12 }}>
          <span className={s.scenePill}>Home Activities</span>
        </div>

        <h1
          className={s.mainTitle}
          style={{ fontSize: "2.4rem", lineHeight: 1.1, marginBottom: 10, letterSpacing: "-0.03em" }}
        >
          Move at home,{" "}
          <span style={{
            background: "linear-gradient(90deg, #6366f1, #10b981)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            feel the difference.
          </span>
        </h1>

        <p className={s.paragraph} style={{ maxWidth: 840, marginBottom: 24, fontSize: "0.95rem" }}>
          You don't need a gym. Everyday tasks and simple movements at home count more than you think — pick what fits your day.
        </p>

        {/* Stat preview pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          {[
            { label: "Confidence", color: "#fef9c3", text: "#9d174d" },
            { label: "Mood",       color: "#dcfce7", text: "#166534" },
            { label: "Health",     color: "#dbeafe", text: "#1e40af" },
            { label: "Energy",     color: "#fce7f3", text: "#854d0e" },
          ].map(({ label, color, text }) => (
            <span key={label} style={{
              padding: "3px 10px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              backgroundColor: color,
              color: text,
            }}>
              {label}
            </span>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {games.map((game) => (
            <button
              key={game.path}
              className={s.primaryButton}
              onClick={() => navigate(href(game.path))}
              style={{
                width: "100%",
                padding: "14px 24px",
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: 14,
                letterSpacing: "-0.01em",
                marginTop: 0,
                cursor: "pointer",
                background: game.color,
                color: "white",
                border: "none",
              }}
            >
              {game.text}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}