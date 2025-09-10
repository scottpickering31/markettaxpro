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
