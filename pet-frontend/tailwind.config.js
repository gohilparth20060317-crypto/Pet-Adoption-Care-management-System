/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16241F",
        paper: "#F1F4EF",
        surface: "#FFFFFF",
        forest: {
          50: "#EAF0EC",
          100: "#CFDDD3",
          300: "#7FA089",
          500: "#3D6E5D",
          600: "#2F5749",
          700: "#233F35",
          900: "#132521",
        },
        marigold: {
          100: "#FCEBC7",
          300: "#F1C572",
          500: "#E8A33D",
          600: "#C8842A",
        },
        brick: {
          100: "#F5DEDB",
          500: "#C4574A",
          600: "#A5453A",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,36,31,0.06), 0 8px 24px -12px rgba(22,36,31,0.18)",
      },
      borderRadius: {
        stamp: "3px",
      },
    },
  },
  plugins: [],
}

