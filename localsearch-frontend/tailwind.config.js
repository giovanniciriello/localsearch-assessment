/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1.5rem',
      },
      fontFamily: {
        sans: ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
