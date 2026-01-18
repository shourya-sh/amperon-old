/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom dark color scale for utilities
        dark: {
          100: "#e8eef2",
          200: "#c9d1d9",
          300: "#8b949e",
          400: "#6e7681",
          500: "#484f58",
          600: "#30363d",
          700: "#21262d",
          800: "#161b22",
          850: "#13171c",
          900: "#0d1117",
          // GitHub dark theme palette
          bg: "#0d1117",
          bgSecondary: "#161b22",
          bgTertiary: "#21262d",
          bgOverlay: "#1c2128",
          border: "#30363d",
          borderMuted: "#21262d",
          text: "#c9d1d9",
          textSecondary: "#8b949e",
          textMuted: "#6e7681",
          textSubtle: "#484f58",
        },
        // Forest green color scale
        forest: {
          300: "#56d364",
          400: "#3fb950",
          500: "#2ea043",
          600: "#238636",
        },
        // GitHub accent colors
        github: {
          green: "#238636",
          greenLight: "#2ea043",
          blue: "#1f6feb",
          blueLight: "#58a6ff",
          red: "#da3633",
          redLight: "#f85149",
          yellow: "#d29922",
          yellowLight: "#e3b341",
          purple: "#8957e5",
          purpleLight: "#a371f7",
        },
        // Component accent colors
        accent: {
          resistor: "#a371f7",
          capacitor: "#58a6ff",
          led: "#e3b341",
          battery: "#f85149",
          wire: "#2ea043",
          switch: "#bc8cff",
        },
        // Duolingo-inspired colors (darker for readability)
        duo: {
          green: "#22c55e",
          greenDark: "#16a34a",
          greenDeep: "#15803d",
          blue: "#38bdf8",
          purple: "#c084fc",
          red: "#f87171",
          orange: "#fb923c",
          yellow: "#fbbf24",
          gray: "#4b4b4b",
          grayLight: "#777777",
        },
      },
      fontFamily: {
        sans: [
          "Fredoka",
          "Geist",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        display: ["Fredoka", "-apple-system", "sans-serif"],
        mono: ["Geist Mono", "Menlo", "Monaco", "Courier New", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.15s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
