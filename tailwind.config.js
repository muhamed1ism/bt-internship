/** @type {import('tailwindcss').Config} */

export default {
  content: ["./app/**/*.{css,html,ts?(x)}"],
  theme: {
    extend: {
      colors: {},
    },
    screens: {
      "custom-md": "1200px",
    },
  },
  plugins: [],
};
