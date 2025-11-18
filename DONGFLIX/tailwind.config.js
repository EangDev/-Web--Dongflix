/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mainBG: "#000000FF",
        headerBG: "#131313",
        hoverBG: "#0095c2",
        activeBG: "#00c3ff",
        sliceBG: "#bbefff",
        txt: "#cccccc",
      },
      fontFamily: {
        space: ["Space Mono", "monospace"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        marquee: "marquee 25s linear infinite",
      },
    },
  },
  plugins: [],
};
