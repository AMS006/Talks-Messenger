/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors:{
        'dark-1':'#212529',
        'dark-2':'#15191d',
        'light-1':'#d5d4d4',
        'light-2':'#e3e3e3',
        'b-light1':'#808080',
        'white':'#fff',
        'text-light-1':'#383843',
        'danger':'#c13131'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    })
  ],
}