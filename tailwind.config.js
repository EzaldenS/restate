/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "rubik": ["Rubik-Regular", "sans-serif"],
        "rubik-bold": ["Rubik-Bold", "sans-serif"],
        "rubik-extra-bold": ["Rubik-ExtraBold", "sans-serif"],
        "rubik-light": ["Rubik-Light", "sans-serif"],
        "rubik-medium": ["Rubik-Medium", "sans-serif"],
        "rubik-semi-bold": ["Rubik-SemiBold", "sans-serif"],
      },
      colors: {
        primary: {
          100: "#EAF3FF",
          200: "#0066FF",
          300: "#0061FF",
          400: "#0055E5",
        },
        accent: {
          100: "#FBFBFD",
        },
        black: {
          DEFAULT: "#000000",
          100: "#8C8E98",
          200: "#666876",
          300: "#191D31",
        },
        danger: "#F75555",
        slate: {
          100: "#E6EEF9",
          200: "#EEF5FF",
          300: "#98A0B5",
          400: "#6B7280",
        },
      },
    },
  },
  plugins: [],
}