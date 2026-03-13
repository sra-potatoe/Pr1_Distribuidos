/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      primary: "#14B8A6",   // turquesa
      secondary: "#7C3AED", // morado
      darkbg: "#0F172A",
      card: "#1E293B"
    }
  }
},
  plugins: [],
}