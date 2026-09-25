import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

/** Maps a CSS channel variable (e.g. "139 187 255") to a Tailwind color with alpha support. */
const token = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        border: token('border'),
        text: token('text'),
        muted: token('muted'),
        primary: token('primary'),
        secondary: token('secondary'),
        tertiary: token('tertiary'),
        'on-accent': token('on-accent'),
      },
      fontFamily: {
        heading: ['Poppins', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      fontSize: {
        xs: ['clamp(0.75rem, 0.72rem + 0.12vw, 0.8125rem)', { lineHeight: '1.5' }],
        sm: ['clamp(0.875rem, 0.85rem + 0.12vw, 0.9375rem)', { lineHeight: '1.55' }],
        base: ['clamp(1rem, 0.96rem + 0.18vw, 1.0625rem)', { lineHeight: '1.65' }],
        lg: ['clamp(1.125rem, 1.07rem + 0.25vw, 1.25rem)', { lineHeight: '1.6' }],
        xl: ['clamp(1.25rem, 1.16rem + 0.4vw, 1.5rem)', { lineHeight: '1.45' }],
        '2xl': ['clamp(1.5rem, 1.35rem + 0.65vw, 1.875rem)', { lineHeight: '1.35' }],
        '3xl': ['clamp(1.875rem, 1.62rem + 1.1vw, 2.5rem)', { lineHeight: '1.25' }],
        '4xl': ['clamp(2.25rem, 1.85rem + 1.75vw, 3.25rem)', { lineHeight: '1.15' }],
        '5xl': ['clamp(2.75rem, 2.1rem + 2.8vw, 4.25rem)', { lineHeight: '1.08' }],
        '6xl': ['clamp(3.25rem, 2.3rem + 4.1vw, 5.5rem)', { lineHeight: '1.02' }],
      },
      backgroundImage: {
        'brand-gradient': 'var(--brand-gradient)',
      },
      boxShadow: {
        glow: '0 0 48px -8px rgb(var(--color-tertiary) / 0.45)',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.text-brand-gradient': {
          backgroundImage: 'var(--brand-gradient)',
          '-webkit-background-clip': 'text',
          backgroundClip: 'text',
          color: 'transparent',
          '-webkit-text-fill-color': 'transparent',
        },
      });
    }),
  ],
} satisfies Config;
