/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Fustat', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Fustat', '-apple-system', 'sans-serif'],
        // "serif" is the reading style; in this design it's the same friendly sans
        serif: ['Fustat', '-apple-system', 'sans-serif'],
        hand: ['Kalam', 'cursive'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // Every brand colour is a CSS variable (see src/index.css → :root),
        // so the whole palette can be changed in one place.
        primary: {
          50: 'rgb(var(--brand-50) / <alpha-value>)',
          100: 'rgb(var(--brand-100) / <alpha-value>)',
          200: 'rgb(var(--brand-200) / <alpha-value>)',
          300: 'rgb(var(--brand-300) / <alpha-value>)',
          400: 'rgb(var(--brand-400) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
          700: 'rgb(var(--brand-700) / <alpha-value>)',
          800: 'rgb(var(--brand-800) / <alpha-value>)',
          900: 'rgb(var(--brand-900) / <alpha-value>)',
          950: 'rgb(var(--brand-950) / <alpha-value>)',
        },
        iris: {
          50: 'rgb(var(--brand2-50) / <alpha-value>)',
          100: 'rgb(var(--brand2-100) / <alpha-value>)',
          200: 'rgb(var(--brand2-200) / <alpha-value>)',
          300: 'rgb(var(--brand2-300) / <alpha-value>)',
          400: 'rgb(var(--brand2-400) / <alpha-value>)',
          500: 'rgb(var(--brand2-500) / <alpha-value>)',
          600: 'rgb(var(--brand2-600) / <alpha-value>)',
          700: 'rgb(var(--brand2-700) / <alpha-value>)',
          800: 'rgb(var(--brand2-800) / <alpha-value>)',
          900: 'rgb(var(--brand2-900) / <alpha-value>)',
          950: 'rgb(var(--brand2-950) / <alpha-value>)',
        },
        ink: 'rgb(var(--ink) / <alpha-value>)',
        night: {
          DEFAULT: 'rgb(var(--night) / <alpha-value>)',
          deep: 'rgb(var(--night-deep) / <alpha-value>)',
          dusk: 'rgb(var(--night-dusk) / <alpha-value>)',
        },
        marigold: {
          50: 'rgb(var(--accent-50) / <alpha-value>)',
          100: 'rgb(var(--accent-100) / <alpha-value>)',
          400: 'rgb(var(--accent-400) / <alpha-value>)',
          500: 'rgb(var(--accent-500) / <alpha-value>)',
          600: 'rgb(var(--accent-600) / <alpha-value>)',
          700: 'rgb(var(--accent-700) / <alpha-value>)',
        },
        mint: {
          50: '#E8FBF4',
          500: '#12B886',
          600: '#0E9A70',
          700: '#0B7A59',
        },
        haze: 'rgb(var(--haze) / <alpha-value>)',
        line: '#E9E5DC',          // hairlines
        muted: '#5C5A57',         // secondary text
        highlight: '#FFD66B',
        paper: '#F7F5F0',
        marker: {
          orange: '#FF6B35',
          green: '#2DB463',
          blue: '#4F9DEB',
          yellow: '#FFD66B',
          brown: '#4B1A11',
        },     // the highlighter
        coral: {
          50: '#FFF7ED',
          500: '#F97316',
          600: '#EA580C',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'hover': '0 12px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'btn': '0 1px 2px rgba(16, 24, 40, 0.08)',
        'lift': '0 12px 32px -12px rgba(16, 24, 40, 0.18)',
        'glass': '0 1px 2px rgba(16, 24, 40, 0.04)',
        'glow': '0 0 0 3px rgb(var(--brand-500) / 0.15)',
      },
      keyframes: {
        aurora: {
          '0%': { transform: 'translate3d(-8%, -6%, 0) rotate(0deg) scale(1)' },
          '100%': { transform: 'translate3d(8%, 6%, 0) rotate(12deg) scale(1.15)' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.96)' },
          '60%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        flicker: {
          '0%, 100%': { transform: 'scale(1) rotate(-2deg)', filter: 'drop-shadow(0 0 0 rgba(255,176,32,0))' },
          '50%': { transform: 'scale(1.08) rotate(2deg)', filter: 'drop-shadow(0 0 6px rgba(255,176,32,0.6))' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
      animation: {
        'gradient-x': 'gradient-x 4s ease infinite',
        'aurora-drift': 'aurora 18s ease-in-out infinite alternate',
        'rise': 'rise 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'pop': 'pop 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.3) both',
        'flicker': 'flicker 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
