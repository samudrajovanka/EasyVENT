module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'ev-black': '#1D1D1D',
        'ev-gray': '#F3F3F3',
        'ev-dark-gray': '#B0B0B0',
        'ev-blue': '#1271FF',
        'ev-red': '#FF2D20',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
