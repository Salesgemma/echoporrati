const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'nero-assoluto': '#0C0C0C',
        'blu-inchiostro': '#202530',
        'grigio-blu-notte': '#333D40',
        'grigio-antracite': '#4B4F51',
        'greige-chiaro': '#C1BDB3',
        'bianco-sporco': '#D9D9D9',
      },
      fontFamily: {
        'serif': ['"Playfair Display"', ...defaultTheme.fontFamily.serif],
        'sans': ['Inter', ...defaultTheme.fontFamily.sans],
        // NUOVA AGGIUNTA
        'bodoni': ['"Bodoni Moda"', ...defaultTheme.fontFamily.serif]
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}