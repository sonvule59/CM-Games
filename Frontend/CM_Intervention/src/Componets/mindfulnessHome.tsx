import { s } from "../Static/officestyles.js";
import { href, useNavigate } from "react-router";
import { BackButton } from "./Layout.js";
export default function mindfulnessHome() {
  const navigate = useNavigate();
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
          src="/assets/Images/mindfulnesshome.png"
          alt="Peaceful meditation environment"
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
          <span className={s.scenePill}>Mindfulness</span>
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
          Check in with,{" "}
          <span style={{
            background: "linear-gradient(90deg, #6366f1, #10b981)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            yourself.
          </span>
        </h1>

        {/* Subtitle */}
        <p className={s.paragraph} style={{ maxWidth: 840, marginBottom: 24, fontSize: "0.95rem" }}>
          A short space for affirming phrases and gentle feedback—no scores to beat.
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
        <button
          className={s.primaryButton}
          onClick={() => { navigate(href("/mindfulness")) }}
          style={{
            width: "100%",
            padding: "14px 24px",
            fontSize: "1rem",
            fontWeight: 700,
            borderRadius: 14,
            letterSpacing: "-0.01em",
            marginTop: 0,
            cursor: "pointer",
          }}
        >
          Start mindfulness game
        </button>

      </div>
    </div>
  );
}