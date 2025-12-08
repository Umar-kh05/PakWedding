/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Wedding Theme
        brand: {
          red: '#D72626',        // Primary Red
          orange: '#F26D46',     // Primary Orange/Coral
          lightOrange: '#F7A76C', // Light Peach Orange
          gold: '#F6A423',       // Gold Accent
        },
        // Background Colors
        cream: {
          light: '#FFF7F1',      // Section background / Hero
          DEFAULT: '#F4E9DB',    // Header background
          hover: '#FEECEC',      // Soft hover tint
        },
        // Text Colors
        text: {
          primary: '#2A2A2A',    // Soft charcoal for body text
        },
        // Legacy colors (keeping for compatibility)
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#D72626', // Updated to brand red
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#F6A423', // Updated to brand gold
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#F26D46', // Updated to brand orange
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

