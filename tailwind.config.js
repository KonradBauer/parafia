/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Główne kolory parafii
        primary: {
          50: '#e6eef5',
          100: '#ccdcea',
          200: '#99b9d5',
          300: '#6696c0',
          400: '#3373ab',
          500: '#1E3A5F', // główny granat
          600: '#182e4c',
          700: '#122339',
          800: '#0c1726',
          900: '#060c13',
        },
        gold: {
          50: '#faf6e8',
          100: '#f5edd1',
          200: '#ebdba3',
          300: '#e1c975',
          400: '#d7b747',
          500: '#C9A227', // główne złoto
          600: '#a1821f',
          700: '#796117',
          800: '#51410f',
          900: '#282008',
        },
        burgundy: {
          50: '#f5e9eb',
          100: '#ebd3d7',
          200: '#d7a7af',
          300: '#c37b87',
          400: '#af4f5f',
          500: '#8B2635', // główny bordo
          600: '#6f1e2a',
          700: '#531720',
          800: '#380f15',
          900: '#1c080b',
        },
        cream: {
          50: '#FDFCFB',
          100: '#F8F6F3', // główny kremowy
          200: '#f1ede7',
          300: '#e9e3db',
          400: '#e2dacf',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        dyslexia: ['OpenDyslexic', 'Comic Sans MS', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(to bottom, rgba(30, 58, 95, 0.7), rgba(30, 58, 95, 0.9))',
      },
    },
  },
  plugins: [],
}
