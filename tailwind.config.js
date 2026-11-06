/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ---- Brand core (deep clinical teal-navy) -----------------------
        ink: {
          DEFAULT: "#0B3B45",
          50: "#EAF2F3",
          100: "#CFE1E3",
          200: "#A3C4C8",
          300: "#73A5AB",
          400: "#3F7E86",
          500: "#14595E",
          600: "#0F484D",
          700: "#0B3B45", // primary
          800: "#082A31",
          900: "#051A1F",
        },
        // ---- Cardiac pulse accent (ECG crimson-rose) --------------------
        pulse: {
          DEFAULT: "#E33F5C",
          50: "#FDECEF",
          100: "#FAD0D8",
          400: "#EA6A82",
          500: "#E33F5C",
          600: "#C42747",
          700: "#9E1E39",
        },
        // ---- Risk scale --------------------------------------------------
        risk: {
          healthy: "#2E9E6B",
          "healthy-bg": "#E7F6EF",
          moderate: "#E8A23D",
          "moderate-bg": "#FDF3E3",
          high: "#E8763D",
          "high-bg": "#FDEBE0",
          critical: "#D1425B",
          "critical-bg": "#FBE3E8",
        },
        // ---- Neutral surface -----------------------------------------
        surface: {
          DEFAULT: "#F6F9FA",
          card: "#FFFFFF",
          border: "#E3EBEC",
        },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 8px rgba(11, 59, 69, 0.06), 0 1px 2px rgba(11, 59, 69, 0.04)",
        card: "0 4px 20px rgba(11, 59, 69, 0.08)",
        lift: "0 12px 32px rgba(11, 59, 69, 0.14)",
        glass: "0 8px 32px rgba(11, 59, 69, 0.1)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        draw: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        draw: "draw 2.2s ease-out forwards",
        "fade-up": "fade-up 0.5s ease-out forwards",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
