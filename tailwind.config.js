/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'pastel-pink': '#fce4ec',
          'pastel-pink-dark': '#f06292',
        },
        fontFamily: {
          serif: ['Playfair Display', 'serif'],
          sans: ['Montserrat', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }