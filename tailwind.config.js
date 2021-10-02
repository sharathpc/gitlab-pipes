const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      orange: colors.orange,
      blue: colors.blue
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
