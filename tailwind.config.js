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
        primary: {
          DEFAULT: "#FF5722",
          dark: "#E64A19",
          light: "#FFF3ED",
          subtle: "#FFF8F5",
        },
        accent: {
          DEFAULT: "#F59E0B",
          dark: "#D97706",
          light: "#FEF3C7",
        },
        dark: {
          DEFAULT: "#0F172A",
          muted: "#334155",
        },
        surface: "#FFFFFF",
        cream: "#FFFDF9",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -8px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.02)",
        "card-hover": "0 22px 35px -10px rgba(255, 87, 34, 0.12), 0 8px 16px -6px rgba(0, 0, 0, 0.06)",
        "primary-glow": "0 10px 25px -5px rgba(255, 87, 34, 0.4)",
        "accent-glow": "0 10px 25px -5px rgba(245, 158, 11, 0.4)",
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

