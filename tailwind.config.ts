import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pod: {
          DEFAULT: '#07080d',
          surface: '#0d0f18',
          raised: '#131621',
          accent: '#4f6ef7',
          'accent-light': '#7c9dff',
          green: '#2dd4a0',
          amber: '#f0a84c',
        },
        'text-primary': '#e2e4ed',
        'text-muted': '#7a7f96',
        'text-dim': '#3d4155',
      },
      borderColor: {
        pod: 'rgba(255,255,255,0.06)',
        mid: 'rgba(255,255,255,0.11)',
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
