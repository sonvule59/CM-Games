import { s } from "../Static/officestyles.js";
import { href, useNavigate } from "react-router";
export default function OfficeGameStart() {
  const navigate = useNavigate();
  return (
    <div className={s.container} style={{ padding: 0, overflow: "hidden", position: "relative" }}>

      <div style={{ position: "relative", width: "100%", height: 340 }}>
        <img
          src="/assets/Images/going_into_work.webp"
          alt="Going into work"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center top",
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
          <span className={s.scenePill}>Office Wellness</span>
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
          Move Better,{" "}
          <span style={{
            background: "linear-gradient(90deg, #6366f1, #10b981)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            feel better.
          </span>
        </h1>

        {/* Subtitle */}
        <p className={s.paragraph} style={{ maxWidth: 420, marginBottom: 24, fontSize: "0.95rem" }}>
          Small moves make a big difference. Choose what fits your energy today every option counts.
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
          onClick={() => { navigate(href("/parking")) }}
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
          Start your day 🚀
        </button>

      </div>
    </div>
  );
}