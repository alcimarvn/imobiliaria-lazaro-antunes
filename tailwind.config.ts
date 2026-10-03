import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f6fc",
          100: "#dbe8f6",
          200: "#bbd5ed",
          300: "#8ebbe1",
          400: "#5a9cd2",
          500: "#3780c2",
          600: "#2666a4",
          700: "#1f5185",
          800: "#1d446e",
          900: "#0f2a4a",
          950: "#0a1b30",
        },
        gold: {
          50: "#fdfbf5",
          100: "#fbf6e8",
          200: "#f6ebcc",
          300: "#eedba4",
          400: "#e3c473",
          500: "#d4a946",
          600: "#b8860b",
          700: "#986809",
          800: "#7b520d",
          900: "#674310",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        heading: ["var(--font-heading)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
