import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx,css}",
    "./src/app/**/*.{ts,tsx,css}",
    "./src/components/**/*.{ts,tsx,css}",
  ],
  theme: {
    extend: {
      keyframes: {
        "gradient-x": {
          "0%": { "background-position": "0% 50%" },
          "100%": { "background-position": "100% 50%" },
        },
      },
      animation: {
        "gradient-x": "gradient-x 1s ease forwards",
      },
      colors: {
        brand: {
          50: "#eef2ff",
          500: "#6366f1",
          700: "#4338ca",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
