/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        slateblue: {
          50: "#eef2ff",
          100: "#dfe6ff",
          200: "#c6d1ff",
          300: "#a3b4ff",
          400: "#7f92ff",
          500: "#6476f7",
          600: "#4d5ddd",
          700: "#414dbe",
          800: "#38439a",
          900: "#313a7d"
        },
        sunrise: {
          50: "#fff5ed",
          100: "#ffe8d4",
          200: "#ffcba8",
          300: "#ffa46f",
          400: "#ff7a36",
          500: "#ff5f12",
          600: "#f04406",
          700: "#c73308",
          800: "#9e2b0f",
          900: "#7f2610"
        },
        mint: {
          50: "#ecfdf6",
          100: "#d2f9e6",
          200: "#aaf0cf",
          300: "#73e0b1",
          400: "#37c98d",
          500: "#12b172",
          600: "#07915d",
          700: "#08744d",
          800: "#0a5b3f",
          900: "#0b4b35"
        }
      },
      boxShadow: {
        panel: "0 24px 80px rgba(15, 23, 42, 0.12)",
        lift: "0 18px 40px rgba(79, 70, 229, 0.16)",
        glow: "0 0 0 1px rgba(255,255,255,0.4), 0 24px 60px rgba(16, 24, 40, 0.18)"
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        display: ["'Sora'", "'Plus Jakarta Sans'", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
