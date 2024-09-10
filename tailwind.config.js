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
        "gradient-start": "#6EE7B7", 
        "gradient-end": "#3B82F6",
        "custom-purple": "#6a0dad", 
        "custom-red": "#f44336", 
      },
       backgroundImage: {
        'gradient-custom': 'linear-gradient(to right, #6a0dad, #f44336)', 
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
