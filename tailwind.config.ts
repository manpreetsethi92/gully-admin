import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',
          surface: '#1a1a1a',
          border: 'rgba(255,255,255,0.1)',
        },
        accent: {
          DEFAULT: '#E50914',
          light: '#ff4757',
        }
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        mono: ['Menlo', 'Monaco', 'monospace'],
      }
    },
  },
  plugins: [],
  darkMode: 'class',
} satisfies Config
