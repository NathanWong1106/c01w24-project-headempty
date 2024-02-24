const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'rich-black': '#0a0e1aff',
      'moss-green': '#9b9a30ff',
      'dark-moss-green': '#404726ff',
      'light-blue': '#93b7beff',
      'off-white': '#fafafa'
    },
    extend: {},
  },
  plugins: [],
});

