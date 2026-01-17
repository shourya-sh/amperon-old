/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // GitHub dark theme palette
        dark: {
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
      },
      fontFamily: {
        sans: [
          "Geist",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
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
