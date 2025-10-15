import { formatColor, parseColor } from 'tailwindcss/lib/util/color'
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
import plugin from 'tailwindcss/plugin'
import { PluginAPI } from 'tailwindcss/types/config'

type Color = {
  mode: 'rgba'
  color: string[]
  alpha: string
}

type InputColor = {
  '--tw-input-color': string
  '--tw-input-hovered': string
}

type InputSize = {
  '--tw-input-size': string
}

module.exports = plugin(({ addComponents, matchComponents, theme }: PluginAPI): void => {
  const hovered: string = '0.1'

  const getAlpha = (color: string, alpha: string = '1'): string => {
    return String(theme(color).replace('<alpha-value>', alpha))
  }

  addComponents({
    '.input': {
      '--tw-input-text': getAlpha('colors.black.DEFAULT'),
      '--tw-input-color': getAlpha('colors.black.DEFAULT'),
      '--tw-input-hovered': getAlpha('colors.black.DEFAULT', hovered),
      display: 'block',
      width: '100%',
      height: 'var(--tw-input-size)',
      color: 'var(--tw-input-text)',
      fontSize: theme('fontSize.base'),
      fontWeight: theme('fontWeight.normal'),
      backgroundColor: getAlpha('colors.white.DEFAULT'),
      padding: 'calc(var(--tw-input-size) / 4) calc(var(--tw-input-size) / 3)',
      border: '1px solid var(--tw-input-color)',
      borderRadius: theme('borderRadius.lg'),
      transitionProperty: 'background-color, border-color, box-shadow, opacity',
      transitionDuration: '200ms',
      transitionTimingFunction: 'ease',
      userSelect: 'initial',
      '&:focus': {
        boxShadow: '0 0 0 1px var(--tw-input-color)',
      },
      '&:disabled': {
        pointerEvents: 'none',
        opacity: '0.5',
      },
      '&-fade': {
        '--tw-input-text': getAlpha('colors.white.DEFAULT'),
        backgroundColor: theme('colors.transparent'),
      },
      '&&-error': {
        '--tw-input-color': getAlpha('colors.red.DEFAULT'),
      },
      '&:-webkit-autofill': {
        color: 'var(--tw-input-text) !important',
        borderColor: 'var(--tw-input-color)',
        background: 'none !important',
        appearance: 'none',
        transition: 'background-color 1000000ms ease-in-out 0ms',
        '-webkit-text-fill-color': 'var(--tw-input-text) !important',
        '-webkit-text-stroke-color': 'var(--tw-input-text) !important',
      },
      '@media (hover)': {
        '&:hover': {
          backgroundColor: 'var(--tw-input-hovered)',
        },
      },
    },
  })
  matchComponents(
    {
      input: (color: string | (({}) => string)): InputColor => {
        if (typeof color === 'function') {
          const value: string = color({})
          const parsed: Color = parseColor(value)

          return {
            '--tw-input-color': value,
            '--tw-input-hovered': formatColor({
              mode: 'rgba',
              color: parsed.color,
              alpha: hovered,
            } as Color),
          }
        }
      },
    },
    {
      values: flattenColorPalette(theme('colors')),
      type: 'color',
    }
  )
  matchComponents(
    {
      input: (constant: number): InputSize => {
        return {
          '--tw-input-size': `${constant / 16}rem`,
        }
      },
    },
    {
      values: theme('constants'),
    }
  )
})
