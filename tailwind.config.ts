import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{vue,js,ts}",
    "./components/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta base: tons de preto (ink) e laranja
        ink: {
          50: "#f5f5f6",
          100: "#e6e7e9",
          200: "#cfd1d5",
          300: "#a9adb3",
          400: "#7c818a",
          500: "#5b6169",
          600: "#3f444c",
          700: "#292c32",
          800: "#191c20",
          900: "#0f1215",
          950: "#0a0b0d",
        },
        orange: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },

        // Cores semânticas
        primary: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
          DEFAULT: "#ea580c",
          foreground: "#ffffff",
        },
        secondary: {
          50: "#f5f5f6",
          100: "#e6e7e9",
          200: "#cfd1d5",
          300: "#a9adb3",
          400: "#7c818a",
          500: "#5b6169",
          600: "#3f444c",
          700: "#292c32",
          800: "#191c20",
          900: "#0f1215",
          950: "#0a0b0d",
          DEFAULT: "#191c20",
          foreground: "#ffffff",
        },
        background: {
          DEFAULT: "#0b0c0e",
          foreground: "#e5e7eb",
        },
        muted: {
          DEFAULT: "#111215",
          foreground: "#9ca3af",
        },
        accent: {
          DEFAULT: "#f97316",
          foreground: "#ffffff",
        },
        border: "#1f2937",
        input: "#1f2937",
        ring: "#f97316",
        card: {
          DEFAULT: "#0f1012",
          foreground: "#e5e7eb",
        },
      },
    },
  },
  plugins: [],
};

export default config;
