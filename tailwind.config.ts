import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f7ff",
          100: "#ebefff",
          500: "#4f67ff",
          700: "#3447d6",
        },
      },
    },
  },
  plugins: [],
};

export default config;
