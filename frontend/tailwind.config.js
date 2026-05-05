/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Locked color palette - Summer-Autumn theme
      colors: {
        primary: '#FF6B6B',      // Warm Coral
        secondary: '#FFB347',    // Golden Amber
        accent: '#C1785A',       // Soft Terracotta
        background: '#FFF8F0',   // Creamy Ivory
      },
      // Locked font family - Verdana
      fontFamily: {
        sans: ['Verdana', 'Geneva', 'sans-serif'],
      },
    },
  },
  plugins: [],
}