/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  // Mode sombre basé sur la classe 'dark'
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}