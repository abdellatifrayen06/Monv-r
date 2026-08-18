/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: '390px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['Jost', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        wordmark: ['Cinzel', 'Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        // Cognac leather — warm, refined accent used for highlights, links and icons.
        brand: {
          50: '#FAF5EF',
          100: '#F1E6D7',
          200: '#E2CBAF',
          300: '#CFAA80',
          400: '#BC8B58',
          500: '#A66E3B', // cognac — primary accent
          600: '#8C5A30',
          700: '#6F4728',
          800: '#5A3B25',
          900: '#4B3220',
        },
        // Warm taupe / stone as a calm secondary neutral
        sage: {
          50: '#F6F4F1',
          100: '#ECE7E0',
          200: '#D8CFC3',
          300: '#BDB0A0',
          400: '#9C8C79',
          500: '#7E6F5C',
          600: '#665949',
          700: '#52483C',
          800: '#433B32',
          900: '#39322B',
        },
        // Muted brass for subtle premium highlights
        gold: {
          400: '#C6A15B',
          500: '#B08A45',
        },
        warm: '#F7F3EC', // ivory / cream page background
        ink: '#1C1815',  // espresso near-black — primary text, buttons, footer
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        'pop-up': 'popUp 0.45s cubic-bezier(0.32, 0.72, 0, 1)',
        'scale-in': 'scaleIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popUp: {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
