/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0FDFA', 100: '#CCFBF1', 200: '#99F6E4', 300: '#5EEAD4',
          400: '#2DD4BF', 500: '#14B8A6', 600: '#0D9488', 700: '#0F766E',
          800: '#115E59', 900: '#134E4A',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'peek': 'peek 0.3s ease-out forwards',
        'hide': 'hide 0.3s ease-out forwards',
        'blink': 'blink 4s infinite',
        'swing-arm-l': 'swingArmL 3s ease-in-out infinite',
        'swing-arm-r': 'swingArmR 3s ease-in-out infinite',
        'body-bob': 'bodyBob 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        glow: { '0%': { boxShadow: '0 0 20px rgba(20, 184, 166, 0.3)' }, '100%': { boxShadow: '0 0 40px rgba(13, 148, 136, 0.5)' } },
        peek: { '0%': { transform: 'translateY(0)' }, '100%': { transform: 'translateY(-15px)' } },
        hide: { '0%': { transform: 'translateY(-15px)' }, '100%': { transform: 'translateY(0)' } },
        blink: { '0%, 45%, 55%, 100%': { transform: 'scaleY(1)' }, '50%': { transform: 'scaleY(0.1)' } },
        swingArmL: { '0%, 100%': { transform: 'rotate(-5deg)' }, '50%': { transform: 'rotate(5deg)' } },
        swingArmR: { '0%, 100%': { transform: 'rotate(5deg)' }, '50%': { transform: 'rotate(-5deg)' } },
        bodyBob: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
      },
    },
  },
  plugins: [],
};
