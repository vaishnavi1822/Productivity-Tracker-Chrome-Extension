/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      textSizeAdjust: {
        '100': '100%'
      }
    },
  },
  plugins: [],
} 