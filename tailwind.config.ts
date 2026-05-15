import type { Config } from 'tailwindcss'
import { animation, button, getColor, input, media, pack, pointer } from './plugins'

const { xs, sm, md, lg, xl, xxl } = media

export default {
  content: ['./src/**/*.html', './src/ts/**/*.ts'],
  darkMode: ['class', '[data-theme="dark"]'],
  corePlugins: {
    container: false,
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    screens: {
      xs: `${xs}px`,
      sm: `${sm}px`,
      md: `${md}px`,
      lg: `${lg}px`,
      xl: `${xl}px`,
      xxl: `${xxl}px`,
    },
    constants: {
      xs: 28,
      sm: 36,
      md: 40,
      lg: 48,
      xl: 56,
      xxl: 64,
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',
      primary: {
        DEFAULT: getColor('primary'),
      },
      second: {
        DEFAULT: getColor('second'),
      },
      black: {
        DEFAULT: getColor('black'),
      },
      white: {
        DEFAULT: getColor('white'),
      },
      gray: {
        DEFAULT: getColor('gray'),
      },
      grey: {
        DEFAULT: getColor('grey'),
      },
      dark: {
        DEFAULT: getColor('dark'),
      },
      red: {
        DEFAULT: getColor('red'),
      },
      green: {
        DEFAULT: getColor('green'),
      },
    },
    fontFamily: {
      alt: 'var(--font-alt)',
      base: 'var(--font-base)',
    },
    gridColumn: {
      1: 'span 1',
      2: 'span 2',
      3: 'span 3',
      4: 'span 4',
      5: 'span 5',
      6: 'span 6',
      7: 'span 7',
      8: 'span 8',
      9: 'span 9',
      10: 'span 10',
      11: 'span 11',
      12: 'span 12',
    },
    gridRow: {
      1: 'span 1',
      2: 'span 2',
      3: 'span 3',
      4: 'span 4',
      5: 'span 5',
      6: 'span 6',
      7: 'span 7',
      8: 'span 8',
      9: 'span 9',
      10: 'span 10',
      11: 'span 11',
      12: 'span 12',
    },
    extend: {
      content: {
        auto: '""',
      },
      fontSize: {
        min: ['0.5rem', '0.625rem'],
        xxs: ['0.625rem', '0.75rem'],
        '1.5xl': ['1.375rem', '1.75rem'],
        '2.5xl': ['1.75rem', '2.125rem'],
      },
      borderRadius: {
        inherit: 'inherit',
      },
    },
  },
  plugins: [pack, input, button, animation, pointer],
} satisfies Config
