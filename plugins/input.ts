import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
import plugin from 'tailwindcss/plugin'
import { CSSRuleObject, PluginAPI } from 'tailwindcss/types/config'
import { getRgba, TailwindPlugin } from './plugin'

export const input: TailwindPlugin = plugin(({ addComponents, matchComponents, theme }: PluginAPI): void => {
  addComponents({
    '.input': {
      '--tw-input-color': getRgba(theme('colors.black.DEFAULT')),
      '--tw-input-text': getRgba(theme('colors.black.DEFAULT')),
      '--tw-input-hovered': `color-mix(in srgb, var(--tw-input-color) 10%, ${theme('colors.transparent')})`,
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
      input: (color: string): CSSRuleObject => {
        return { '--tw-input-color': typeof color === 'function' ? (color as ({}) => string)({}) : color }
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
        const value: string = String(constant)
        const number: number = parseFloat(value)
        const size: string = value.endsWith('rem') || value.endsWith('em') ? value : `${number / 16}rem`

        return { '--tw-input-size': size }
      }
    },
    {
      values: theme('constants')
    }
  )
})
