/**
 * components/PulseLine.jsx
 * ==========================
 * The brand's signature element: an animated ECG trace.
 *   - variant="hero"    - draws itself on load, in the marketing hero
 *   - variant="divider" - a slim static trace used as a section divider / logo mark
 *   - variant="loader"  - a small looping trace used as a loading indicator
 */

const HERO_PATH =
  "M0,60 L120,60 L150,60 L165,20 L185,100 L205,60 L230,60 L245,40 L255,60 L400,60 L430,60 L450,15 L472,105 L495,60 L520,60 L535,45 L548,60 L700,60";

const DIVIDER_PATH = "M0,20 L60,20 L75,20 L84,5 L96,35 L108,20 L120,20 L400,20";

export default function PulseLine({ variant = "divider", className = "", color = "#E33F5C" }) {
  if (variant === "hero") {
    return (
      <svg viewBox="0 0 700 120" fill="none" className={className} aria-hidden="true" preserveAspectRatio="none">
        <path
          d={HERO_PATH}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="animate-draw"
        />
      </svg>
    );
  }

  if (variant === "loader") {
    return (
      <svg viewBox="0 0 120 40" className={className} aria-hidden="true">
        <path
          d="M0,20 L30,20 L38,20 L44,6 L52,34 L60,20 L68,20 L120,20"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray="60 300"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-360" dur="1.4s" repeatCount="indefinite" />
        </path>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 40" className={className} aria-hidden="true" preserveAspectRatio="none">
      <path d={DIVIDER_PATH} stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
