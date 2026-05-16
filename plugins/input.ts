import { formatColor, parseColor } from 'tailwindcss/lib/util/color'
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
import plugin from 'tailwindcss/plugin'
import { CSSRuleObject, PluginAPI } from 'tailwindcss/types/config'
import { Color, getRgba, TailwindPlugin } from './plugin'

const hovered: string = '0.1'

export const input: TailwindPlugin = plugin(({ addComponents, matchComponents, theme }: PluginAPI): void => {
  addComponents({
    '.input': {
      '--tw-input-text': getRgba(theme('colors.black.DEFAULT')),
      '--tw-input-color': getRgba(theme('colors.black.DEFAULT')),
      '--tw-input-hovered': getRgba(theme('colors.black.DEFAULT'), hovered),
      display: 'block',
      width: '100%',
      height: 'var(--tw-input-size)',
      color: 'var(--tw-input-text)',
      fontSize: theme('fontSize.base'),
      fontWeight: theme('fontWeight.normal'),
      backgroundColor: getRgba(theme('colors.white.DEFAULT')),
      padding: 'calc(var(--tw-input-size) / 4) calc(var(--tw-input-size) / 3)',
      border: '1px solid var(--tw-input-color)',
      borderRadius: theme('borderRadius.lg'),
      transitionProperty: 'background-color, border-color, box-shadow, opacity',
      transitionDuration: '200ms',
      transitionTimingFunction: 'ease',
      userSelect: 'initial',
      '&:focus': {
        boxShadow: '0 0 0 1px var(--tw-input-color)'
      },
      '&:disabled': {
        pointerEvents: 'none',
        opacity: '0.5'
      },
      '&-fade': {
        '--tw-input-text': getRgba(theme('colors.white.DEFAULT')),
        backgroundColor: theme('colors.transparent')
      },
      '&&-error': {
        '--tw-input-color': getRgba(theme('colors.red.DEFAULT'))
      },
      '&:-webkit-autofill': {
        color: 'var(--tw-input-text) !important',
        borderColor: 'var(--tw-input-color)',
        background: 'none !important',
        appearance: 'none',
        transition: 'background-color 1000000ms ease-in-out 0ms',
        '-webkit-text-fill-color': 'var(--tw-input-text) !important',
        '-webkit-text-stroke-color': 'var(--tw-input-text) !important'
      },
      '@media (hover)': {
        '&:hover': {
          backgroundColor: 'var(--tw-input-hovered)'
        }
      }
    }
  })
  matchComponents(
    {
      input: (color: string): CSSRuleObject | null => {
        if (typeof color === 'function') {
          const value: string = (color as ({}) => string)({})
          const parsed: Color = parseColor(value)

          return {
            '--tw-input-color': value,
            '--tw-input-hovered': formatColor({
              mode: 'rgba',
              color: parsed.color,
              alpha: hovered
            } as Color)
          }
        }

        return null
      }
    },
    {
      values: flattenColorPalette(theme('colors')),
      type: 'color'
    }
  )
  matchComponents(
    {
      input: (constant: string | number): CSSRuleObject => {
        return { '--tw-input-size': `${Number(constant) / 16}rem` }
      }
    },
    {
      values: theme('constants')
    }
  )
})
