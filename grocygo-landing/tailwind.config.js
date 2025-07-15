/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(20, 184, 166, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(20, 184, 166, 0.8), 0 0 30px rgba(251, 146, 60, 0.5)' },
        }
      },
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
        'glow-teal': '0 0 20px rgba(20, 184, 166, 0.5)',
        'glow-orange': '0 0 20px rgba(251, 146, 60, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
      letterSpacing: {
        'ultra-wide': '0.2em',
      }
    },
  },
  plugins: [],
};