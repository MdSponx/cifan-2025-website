/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'oswald': ['Oswald', 'sans-serif'],
        'anuphan': ['Anuphan', 'sans-serif'],
      },
      fontWeight: {
        'thin': '100',
        'extralight': '200',
        'light': '300',
        'regular': '400',
        'medium': '500',
        'semibold': '600',
      },
      colors: {
        'cifan-navy': '#00305A',
        'cifan-blue': '#3B6891', 
        'cifan-peach': '#FCB283',
        'cifan-dark': '#110D16',
        'cifan-orange': '#AA4626',
      },
    },
  },
  plugins: [],
};