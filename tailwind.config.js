import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      animation: {
        "bg-gradient": "bgGradient 5s linear infinite",
      },
      keyframes: {
        bgGradient: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "100% 100%" },
        },
      },
      colors: {
        "gradient-start": "#6EE7B7", // Ajusta estos colores a tu preferencia
        "gradient-end": "#3B82F6",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
