/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          950: "#0B3D40",
          900: "#0D4A4E",
          800: "#105A5F",
          700: "#146A70",
          600: "#1A8A91",
          500: "#20AAAD",
          400: "#3FC4C7",
        },
        gold: {
          600: "#A6762A",
          500: "#C9963A",
          400: "#D4A847",
          300: "#E2C07A",
          200: "#F0D9A8",
          100: "#FAF0D7",
        },
        cream: {
          DEFAULT: "#F5EFE6",
          dark: "#EDE4D6",
        },
        navy: {
          950: "#060D1A",
          900: "#0A1628",
          800: "#0F2240",
          700: "#162D52",
        },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        body: ["'Nunito'", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      boxShadow: {
        card: "0 4px 24px rgba(11,61,64,0.10)",
        "card-hover": "0 12px 40px rgba(11,61,64,0.18)",
        gold: "0 4px 20px rgba(201,150,58,0.25)",
      },
    },
  },
  plugins: [],
};