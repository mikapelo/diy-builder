/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:     ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        headline: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        body:     ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* ── Legacy green (backward compat) ── */
        green: {
          50:  '#F0FBF0',
          100: '#DCF5DC',
          200: '#B2DFBB',
          500: '#4CAF50',
          600: '#2E7D32',
          700: '#1B5E20',
        },
        /* ── Atelier Design System ── */
        primary:             '#C9971E',
        'primary-dark':      '#A07A14',
        'primary-container': '#FFF8E1',
        secondary:           '#1B3022',
        'secondary-light':   '#476553',
        'on-primary':        '#FFFFFF',
        'on-secondary':      '#FFFFFF',
        /* Surface hierarchy */
        surface:                    '#faf9f7',
        'surface-dim':              '#dadad8',
        'surface-container-lowest': '#ffffff',
        'surface-container-low':    '#f4f3f1',
        'surface-container':        '#efeeec',
        'surface-container-high':   '#e9e8e6',
        'surface-container-highest':'#e3e2e0',
        /* Text */
        'on-surface':         '#1a1c1b',
        'on-surface-variant': '#4e4637',
        /* Outline */
        outline:              '#7f7665',
        'outline-variant':    '#d1c5b2',
        /* Inverse (dark sections) */
        'inverse-surface':    '#1A1C1B',
        'inverse-on-surface': '#f1f1ef',
        'inverse-primary':    '#C9971E',
        /* Sky accent (technique / export) */
        'sky-accent':    '#E3F2FD',
        'sky-on-accent': '#0D47A1',
        /* Validation green */
        'valid':         '#2E7D32',
        'valid-light':   '#E8F5E9',
      },
      borderRadius: {
        '3xl':  '1.5rem',
        '4xl':  '2rem',
        '5xl':  '2.5rem',
      },
    },
  },
  plugins: [],
};
