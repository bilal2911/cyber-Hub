/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': {
          DEFAULT: '#0b1329',
          card: '#0f172a',
          light: '#1e293b',
        },
        'cream': {
          DEFAULT: '#faf7f2',
          card: '#ffffff',
          dark: '#f5f0e6',
        },
        'teal-accent': {
          DEFAULT: '#14b8a6',
          hover: '#0d9488',
          glow: 'rgba(20, 184, 166, 0.15)',
        },
        'gold-accent': {
          DEFAULT: '#d4af37',
          hover: '#c59b27',
          glow: 'rgba(212, 175, 55, 0.2)',
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'lg': '12px',
        'xl': '20px',
        '2xl': '30px',
      },
      boxShadow: {
        'premium-sm': '0 2px 4px rgba(0, 0, 0, 0.04)',
        'premium-md': '0 10px 20px rgba(11, 19, 41, 0.05)',
        'premium-lg': '0 20px 40px rgba(11, 19, 41, 0.08)',
        'glow': '0 8px 30px rgba(20, 184, 166, 0.2)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
