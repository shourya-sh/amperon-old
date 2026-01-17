/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark grey palette - Linear inspired
        dark: {
          50: '#f7f7f8',
          100: '#e8e8eb',
          200: '#d1d1d8',
          300: '#a9a9b8',
          400: '#7c7c8d',
          500: '#5c5c6d',
          600: '#4a4a58',
          700: '#3d3d47',
          800: '#1f1f25',
          850: '#1a1a1f',
          900: '#0f0f13',
          950: '#080809',
        },
        // Forest green palette - darker
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Accent colors for components
        accent: {
          resistor: '#a78bfa',
          capacitor: '#60a5fa',
          led: '#fbbf24',
          battery: '#f87171',
          wire: '#16a34a',
          switch: '#c084fc',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
