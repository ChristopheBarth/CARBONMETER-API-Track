/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  // Mode sombre basé sur la classe 'dark'
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        // on récupère la variable CSS qu’on a instanciée en layout
        sans: ['var(--font-roboto)', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}