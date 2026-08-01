import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vellum: "#050505",       // page background — near-black, like the screenshot
        ink: "#F2EFE7",          // primary text — warm off-white, not pure white
        "ink-dim": "#9A968B",    // secondary text
        rule: "rgba(242,239,231,0.14)", // hairline dividers
        brass: "#B8935F",        // signature accent — used sparingly
        crimson: "#7A2A2A",      // rare emphasis (rubric red, manuscript tradition)
      },
      fontFamily: {
        display: ["var(--font-spectral)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      maxWidth: {
        prose: "42rem",
        page: "72rem",
      },
    },
  },
  plugins: [],
};
export default config;
