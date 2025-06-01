/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // adjust path if needed
  theme: {
    extend: {
      colors: {
        primary: '#401135',
        secondary: '#d0f0ec',
        accent: '#00c2a8',
      },
    },
  },
  plugins: [],
}
