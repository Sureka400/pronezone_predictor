/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#0a0e1a',
          secondary: '#1a1f2e',
        },
        accent: {
          cyan: '#00d4ff',
          purple: '#8b5cf6',
          teal: '#14b8a6',
        },
        risk: {
          high: '#ff4c4c',
          medium: '#ffb020',
          low: '#2ed573',
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.1)',
          border: 'rgba(255, 255, 255, 0.2)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'grid-move': 'grid-move 20s linear infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite alternate',
        'ripple': 'ripple 0.6s linear',
        'slide-in-up': 'slide-in-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 212, 255, 0.8), 0 0 40px rgba(0, 212, 255, 0.3)' },
        },
        'grid-move': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
        'neon-pulse': {
          '0%': { textShadow: '0 0 20px #00d4ff' },
          '100%': { textShadow: '0 0 30px #00d4ff, 0 0 40px #00d4ff' },
        },
        ripple: {
          'to': { transform: 'scale(4)', opacity: '0' },
        },
        'slide-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'city-grid': 'linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
    },
  },
  plugins: [],
}