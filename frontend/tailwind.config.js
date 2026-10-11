/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#D32F2F',
          darkred: '#991B1B',
          crimson: '#B71C1C',
          brightred: '#DC2626',
          yellow: '#FACC15',
          gold: '#EAB308',
          amber: '#F59E0B',
          brightyellow: '#FFD700',
          black: '#0A0A0A',
          charcoal: '#121212',
          dark: '#18181B',
          gray: '#27272A',
          lightgray: '#F4F4F5'
        }
      },
      fontFamily: {
        newspaper: ['"Tiro Devanagari Hindi"', '"Rozha One"', 'Georgia', 'serif'],
        devanagari: ['"Yantramanav"', '"Tiro Devanagari Hindi"', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
}
