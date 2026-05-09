/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#06080f',
        'bg-card': '#0c1020',
        'lfi-red': '#d42b3a',
        'lfi-orange': '#e85530',
        'rn-blue': '#1a40cc',
        'rn-dark': '#0a1a3e',
        'gold': '#d4af37',
        'gold-light': '#f0c040',
        'muted': '#8892a4',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'Haettenschweiler', 'sans-serif'],
        heading: ['"Outfit"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out both',
        'fade-in': 'fadeIn 0.6s ease-out both',
        'slide-left': 'slideLeft 0.8s ease-out both',
        'slide-right': 'slideRight 0.8s ease-out both',
        'scale-in': 'scaleIn 0.6s ease-out both',
        'glow': 'glowPulse 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(-48px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(48px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.08)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'lfi-gradient': 'linear-gradient(135deg, #d42b3a 0%, #e85530 100%)',
        'rn-gradient': 'linear-gradient(135deg, #0a1a3e 0%, #1a40cc 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #f0c040 100%)',
      },
    },
  },
  plugins: [],
}
