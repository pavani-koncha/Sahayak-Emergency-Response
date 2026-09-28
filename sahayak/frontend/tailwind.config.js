/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        danger: '#DC2626', // red-600
        'danger-hover': '#B91C1C', // red-700
      }
    },
  },
  plugins: [],
}
