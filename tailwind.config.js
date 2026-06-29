/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        spin: { to: { transform: 'rotate(360deg)' } },
        toastIn: {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        barShrink: { from: { transform: 'scaleX(1)' }, to: { transform: 'scaleX(0)' } },
        drawCircle: { to: { strokeDashoffset: '0' } },
        drawCheck: { to: { strokeDashoffset: '0' } },
      },
      animation: {
        'fade-up': 'fadeUp 0.25s ease-out both',
        'fade-in': 'fadeIn 0.3s ease-out both',
        'scale-in': 'scaleIn 0.2s ease-out both',
        spin: 'spin 0.7s linear infinite',
        'toast-in': 'toastIn 0.3s ease-out both',
        'bar-shrink': 'barShrink 3.6s linear forwards',
        'draw-circle': 'drawCircle 0.5s ease-out forwards',
        'draw-check': 'drawCheck 0.35s ease-out 0.4s forwards',
      },
    },
  },
  plugins: [],
};
