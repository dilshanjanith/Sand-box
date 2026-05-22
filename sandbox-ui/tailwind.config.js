/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        sandbox: {
          background: "#f5f5f3",
          card: "#f8f8f7",
          green: "#20b26c",
          lightGreen: "#ebfaf1",
          text: "#1d1d1f",
          muted: "#9b9b9b",
          border: "#ececec",
        },
      },
    },
  },

  plugins: [],
};