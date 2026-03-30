import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: "#f4ede4",
        forest: "#0f4f45",
        cedar: "#17392f",
        gold: "#d7b26d",
        ink: "#15211d",
        mist: "#eef7f3",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 79, 69, 0.12)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top, rgba(215,178,109,0.35), rgba(215,178,109,0) 45%), radial-gradient(circle at bottom right, rgba(15,79,69,0.15), rgba(15,79,69,0) 45%)",
      },
    },
  },
  plugins: [],
};

export default config;

