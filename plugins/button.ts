import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
import plugin from 'tailwindcss/plugin'
import { CSSRuleObject, PluginAPI } from 'tailwindcss/types/config'
import { getRgba, TailwindPlugin } from './plugin'

export const button: TailwindPlugin = plugin(({ addComponents, matchComponents, theme }: PluginAPI): void => {
  addComponents({
    '.btn': {
      '*': {
        pointerEvents: 'none'
      },
      '--tw-btn-color': getRgba(theme('colors.black.DEFAULT')),
      '--tw-btn-accent': getRgba(theme('colors.white.DEFAULT')),
      '--tw-btn-hovered': getRgba(theme('colors.black.DEFAULT')),
      '--tw-btn-fade': `color-mix(in srgb, var(--tw-btn-color) 30%, ${theme('colors.transparent')})`,
      '--tw-btn-focus': `color-mix(in srgb, var(--tw-btn-color) 40%, ${theme('colors.transparent')})`,
      '--tw-btn-fill': 'color-mix(in srgb, var(--tw-btn-color) 80%, var(--tw-btn-hovered))',
      color: 'var(--tw-btn-color)',
      fontSize: theme('fontSize.base'),
      fontWeight: theme('fontWeight.semibold'),
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      userSelect: 'none',
      transitionProperty: 'color, background-color, border-color, box-shadow, opacity, transform',
      transitionDuration: '200ms',
      transitionTimingFunction: 'ease',
      cursor: 'pointer',
      '&:disabled': {
        pointerEvents: 'none',
        opacity: '0.5'
      },
      '&:focus-visible': {
        boxShadow: '0 0 0 4px var(--tw-btn-focus)',
        backgroundColor: 'var(--tw-btn-fade)'
      },
      '@media (hover)': {
        '&:hover': {
          backgroundColor: 'var(--tw-btn-fade)'
        },
        '&:active': {
          boxShadow: `inset 0 4px 4px ${getRgba(theme('colors.black.DEFAULT'), '0.3')}`,
          transform: 'translateY(0.25rem)'
        }
      },
      '&-fill': {
        color: 'var(--tw-btn-accent)',
        backgroundColor: 'var(--tw-btn-color)',
        '&:focus-visible': {
          backgroundColor: 'var(--tw-btn-fill)'
        },
        '@media (hover)': {
          '&:hover': {
            backgroundColor: 'var(--tw-btn-fill)'
          }
        }
      },
      '&-fade': {
        backgroundColor: 'var(--tw-btn-fade)',
        '&:focus-visible': {
          color: 'var(--tw-btn-accent)',
          backgroundColor: 'var(--tw-btn-color)'
        },
        '@media (hover)': {
          '&:hover': {
            color: 'var(--tw-btn-accent)',
            backgroundColor: 'var(--tw-btn-color)'
          }
        }
      },
      '&-text': {
        backgroundColor: 'var(--tw-btn-accent)',
        border: '1px solid var(--tw-btn-accent)',
        '&:focus-visible': {
          backgroundColor: 'var(--tw-btn-accent)',
          borderColor: 'var(--tw-btn-color)'
        },
        '@media (hover)': {
          '&:hover': {
            backgroundColor: 'var(--tw-btn-accent)',
            borderColor: 'var(--tw-btn-color)'
          }
        }
      },
      '&-contur': {
        border: '1px solid var(--tw-btn-color)'
      },
      '&-light': {
        '--tw-btn-hovered': getRgba(theme('colors.white.DEFAULT'))
      },
      '&-swipe': {
        zIndex: '1',
        overflow: 'hidden',
        '&::before': {
          content: theme('content.auto'),
          position: 'absolute',
          zIndex: '-1',
          top: '0',
          right: '0',
          bottom: '0',
          left: 'auto',
          width: '0',
          transition: 'width 200ms ease-in-out',
          backgroundColor: 'var(--tw-btn-color)'
        },
        '@media (hover)': {
          '&:hover': {
            color: 'var(--tw-btn-accent)',
            backgroundColor: theme('colors.transparent'),
            '&::before': {
              left: '0',
              width: '100%'
            }
          }
        }
      }
    }
  })
  matchComponents(
    {
      btn: (color: string): CSSRuleObject => {
        return { '--tw-btn-color': typeof color === 'function' ? (color as ({}) => string)({}) : color }
      }
    },
    {
      values: flattenColorPalette(theme('colors')),
      type: 'color'
    }
  )
  matchComponents(
    {
      btn: (constant: string | number): CSSRuleObject => {
        const value: string = String(constant)
        const number: number = parseFloat(value)
        const size: string = value.endsWith('rem') || value.endsWith('em') ? value : `${number / 16}rem`

        return {
          '--tw-btn-size': size,
          borderRadius: theme('borderRadius.md'),
          height: 'var(--tw-btn-size)',
          paddingInline: `calc(var(--tw-btn-size) / 2)`
        }
      }
    },
    {
      values: theme('constants')
    }
  )
})
