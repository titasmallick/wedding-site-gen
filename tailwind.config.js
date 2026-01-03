import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        cursive: ["var(--font-cursive)"],
      },
      colors: {
        wedding: {
          pink: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#ec4899', // Primary pink
            600: '#db2777',
            700: '#be185d',
            800: '#9d174d',
            900: '#831843',
          },
          gold: {
            50: '#fbf7eb',
            100: '#f5ebd1',
            200: '#edd5a3',
            300: '#e3b86e',
            400: '#d99e43', // Primary gold
            500: '#d2862d',
            600: '#b86623',
            700: '#934a1e',
          },
          cream: '#fcfbf7',
          champagne: '#f7e7ce',
        }
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}

module.exports = config;