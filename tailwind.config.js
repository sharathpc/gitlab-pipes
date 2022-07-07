const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      white: colors.white,
      black: colors.black,
      orange: colors.orange,
      blue: colors.blue,
      gray: colors.gray,
      green: colors.green,
      red: colors.red,
    }
  },
  variants: {
    extend: {
      opacity: ['disabled']
    }
  },
  plugins: [],
}
