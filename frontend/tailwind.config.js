/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        black: '#0a0a0a',
        charcoal: '#1a1a1a',
        silver: '#a0a0a0',
        lightgray: '#f5f5f5',
      }
    },
  },
  plugins: [],
}