/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-base': '#0A0A0A',
        'dark-lighter': '#121212',
        'card-charcoal': '#1A1A1A',
        'neon-purple': '#D000FF', // Vivid purple
        'electric-blue': '#00FFFF', // Cyan/Electric Blue
        'fluoro-green': '#39FF14', // Fluoro Green
        'glass': 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
