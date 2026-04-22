import { s } from "../Static/officestyles.js";
import { href, useNavigate } from "react-router";
import { BackButton } from "./Layout.js";
export default function leisureHome() {
  const navigate = useNavigate();

  const games = [
    { path: "/rock", text: "Rock Climbing 🧗", color: "#ef4444" },
    {
      path: "/outdoors",
      text: "Outdoors Activities (Lake) 🚣‍♂️",
      color: "#3b82f6",
    },
    { path: "/walk", text: "Walking Activities 🚶‍♂️", color: "#10b981" },
    { path: "/swim", text: "Swimming Activities 🏊‍♂️", color: "#06b6d4" },
  ] as const;
  
  return (
    <div className={s.container} style={{ padding: 0, overflow: "hidden", position: "relative" }}>

      <BackButton onClick={() => navigate(href("/"))}
        style={{
          position:"absolute",
          top: "20px",
          right: "20px",
          zIndex: 10,
          margin: 0
        }}
        >
        Back to hub
      </BackButton>

      <div style={{ position: "relative", width: "100%", height: 340 }}>
        <img
          src="/assets/Images/leisure_homepage.png"
          alt="Leisure Natural Landscape"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />
        {/* Gradient fade so image bleeds into the card content below */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: "linear-gradient(to bottom, transparent, #f8fafc)",
        }} />
      </div>

      {/* Card content */}
      <div style={{ padding: "0 28px 32px", marginTop: -16, position: "relative" }}>

        {/* Scene pill */}
        <div style={{ marginBottom: 12 }}>
          <span className={s.scenePill}>Active Transport</span>
        </div>

        {/* Title */}
        <h1
          className={s.mainTitle}
          style={{
            fontSize: "2.4rem",
            lineHeight: 1.1,
            marginBottom: 10,
            letterSpacing: "-0.03em",
          }}
        >
          Choose Your{" "}
          <span style={{
            background: "linear-gradient(90deg, #6366f1, #10b981)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Perfect Escape.
          </span>
        </h1>

        {/* Subtitle */}
        <p className={s.paragraph} style={{ maxWidth: 840, marginBottom: 24, fontSize: "0.95rem" }}>
          Whether you need a focused challenge, a peaceful stroll, or a breath of fresh air, find your perfect balance here.
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

        {/* CTA button */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {games.map((game, index) => (
            <button
              key={index}
              className={s.primaryButton}
              onClick={() => { navigate(href(game.path)) }}
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
                textAlign: "left", 
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span>{game.text}</span>
              <span style={{ fontSize: "1.2rem", opacity: 0.8 }}>➔</span> 
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}