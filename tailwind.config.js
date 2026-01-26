/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F97316", // Sunset Orange
        secondary: "#10B981", // Emerald Green for freshness/success
        background: "#FAFAF9", // Warm Stone-50
        surface: "#FFFFFF",
        typography: {
            main: "#1F2937", // Gray-800
            muted: "#6B7280", // Gray-500
        }
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "sans-serif"],
        sans: ["var(--font-jakarta)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
