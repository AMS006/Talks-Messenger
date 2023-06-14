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
        'dark-1':'#0d121b',
        'dark-2':'#020d14',
        'light-1':'#caccd5',
        'light-2':'#dcdde3de',
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