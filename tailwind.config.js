/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans KR', 'sans-serif']
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'slide-left': 'slideLeft 0.6s ease forwards',
        'slide-right': 'slideRight 0.6s ease forwards',
        'typewriter': 'typewriter 0.1s step-end forwards',
        'progress': 'progressFill 1s ease forwards'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        }
      }
    }
  },
  plugins: []
}
