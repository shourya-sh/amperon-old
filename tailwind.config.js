/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark grey palette
        dark: {
          50: '#f7f7f8',
          100: '#ececef',
          200: '#d5d5db',
          300: '#b1b1bc',
          400: '#878798',
          500: '#6a6a7a',
          600: '#545463',
          700: '#454552',
          800: '#3b3b45',
          900: '#27272e',
          950: '#1a1a1f',
        },
        // Forest green palette
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Accent colors for components
        accent: {
          resistor: '#c084fc',
          capacitor: '#60a5fa',
          led: '#fbbf24',
          battery: '#f87171',
          wire: '#6ee7b7',
          switch: '#a78bfa',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(34, 197, 94, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
