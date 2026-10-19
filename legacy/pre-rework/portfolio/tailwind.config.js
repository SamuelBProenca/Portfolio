// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fall: {
          '0%': {
            transform: 'translateY(-10vh) translateX(0) rotate(0deg)',
            opacity: '1'
          },
          '50%': {
            /* meio do percurso faz uma pequena oscilação lateral */
            transform: 'translateY(40vh) translateX(calc(var(--sway) / 2)) rotate(180deg)',
            opacity: '0.95'
          },
          '100%': {
            transform: 'translateY(110vh) translateX(var(--sway)) rotate(360deg)',
            opacity: '0.85'
          },
        },
      },
      animation: {
        fall: 'fall linear infinite',
      },
    },
  },
  plugins: [],
};
