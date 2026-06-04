import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        edge: {
          bg: "#050b12",
          panel: "#071523",
          line: "#18314a",
          cyan: "#22d3ee",
          lime: "#b7ff3c",
          pink: "#ff4f7b",
          amber: "#fbbf24",
          text: "#f7fbff",
          muted: "#95a3b8"
        }
      },
      boxShadow: {
        edge: "0 22px 80px rgba(0, 0, 0, 0.45), 0 0 34px rgba(34, 211, 238, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
