/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Custom theme colors that work with CSS variables
        'warp': {
          'primary': '#00d9ff',
          'secondary': '#ff6b35',
          'dark-bg': '#0a0a0a',
          'dark-secondary': '#111111',
          'dark-tertiary': '#1a1a1a',
        }
      },
      animation: {
        'theme-lift': 'themeLift 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        themeLift: {
          '0%': { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
          '100%': { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
