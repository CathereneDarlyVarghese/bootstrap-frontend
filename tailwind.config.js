/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [require('daisyui')],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  daisyui: {
    styled: true,
    // themes: ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"],
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: '',
    darkTheme: 'light'
  },
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f8fb',
          100: '#eaf1f7',
          200: '#c8ddee',
          300: '#a6c1e4',
          400: '#6391d1',
          500: '#2161be',
          600: '#1d57a8',
          700: '#164076',
          800: '#11305a',
          900: '#0b203d'
        }
      }
    }
  }
};
