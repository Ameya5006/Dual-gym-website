/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        boxing: {
          red: '#C0392B',
          dark: '#0A0A0A',
          gray: '#1A1A1A',
          light: '#F5F5F5',
        },
        nisha: {
          rose: '#C2185B',
          pink: '#FCE4EC',
          gold: '#F9A825',
          dark: '#1A0010',
          cream: '#FFF8F9',
        },
      },
      fontFamily: {
        boxing: ['Barlow Condensed', 'sans-serif'],
        nisha: ['Cormorant Garamond', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}