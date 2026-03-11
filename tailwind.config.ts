import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        duracell: {
          gold: "#D4A843",
          green: "#2D8C3C",
          blue: "#1B6B8A",
          black: "#000000",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { textShadow: "0 0 10px #D4A843, 0 0 20px #D4A843" },
          "50%": { textShadow: "0 0 20px #D4A843, 0 0 40px #D4A843, 0 0 60px #D4A843" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
