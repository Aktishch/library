import { formatColor, parseColor } from 'tailwindcss/lib/util/color'
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
import plugin from 'tailwindcss/plugin'
import { PluginAPI } from 'tailwindcss/types/config'

type Color = {
  mode: 'rgba'
  color: string[]
  alpha: string
}

type OpacityValue = {
  fade: string
  focus: string
}

type BtnColor = {
  '--tw-btn-color': string
  '--tw-btn-fade': string
  '--tw-btn-focus': string
}

type BtnSize = {
  '--tw-btn-size': string
  borderRadius: string
  height: string
  paddingInline: string
}

module.exports = plugin(({ addComponents, matchComponents, theme }: PluginAPI): void => {
  const opacityValue: OpacityValue = {
    fade: '0.3',
    focus: '0.4',
  }

  const getAlpha = (color: string, alpha: string = '1'): string => {
    return String(theme(color).replace('<alpha-value>', alpha))
  }

  addComponents({
    '.btn': {
      '*': {
        pointerEvents: 'none',
      },
      '--tw-btn-color': getAlpha('colors.black.DEFAULT'),
      '--tw-btn-fade': getAlpha('colors.black.DEFAULT', opacityValue.fade),
      '--tw-btn-focus': getAlpha('colors.black.DEFAULT', opacityValue.focus),
      '--tw-btn-accent': getAlpha('colors.white.DEFAULT'),
      '--tw-btn-hovered': getAlpha('colors.black.DEFAULT'),
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
        opacity: '0.5',
      },
      '&:focus-visible': {
        boxShadow: '0 0 0 4px var(--tw-btn-focus)',
        backgroundColor: 'var(--tw-btn-fade)',
      },
      '@media (hover)': {
        '&:hover': {
          backgroundColor: 'var(--tw-btn-fade)',
        },
        '&:active': {
          boxShadow: `inset 0 4px 4px ${getAlpha('colors.black.DEFAULT', opacityValue.fade)}`,
          transform: 'translateY(0.25rem)',
        },
      },
      '&-fill': {
        color: 'var(--tw-btn-accent)',
        backgroundColor: 'var(--tw-btn-color)',
        '&:focus-visible': {
          backgroundColor: 'var(--tw-btn-fill)',
        },
        '@media (hover)': {
          '&:hover': {
            backgroundColor: 'var(--tw-btn-fill)',
          },
        },
      },
      '&-fade': {
        color: 'var(--tw-btn-color)',
        backgroundColor: 'var(--tw-btn-fade)',
        '&:focus-visible': {
          color: 'var(--tw-btn-accent)',
          backgroundColor: 'var(--tw-btn-color)',
        },
        '@media (hover)': {
          '&:hover': {
            color: 'var(--tw-btn-accent)',
            backgroundColor: 'var(--tw-btn-color)',
          },
        },
      },
      '&-text': {
        color: 'var(--tw-btn-color)',
        backgroundColor: 'var(--tw-btn-accent)',
        border: `1px solid ${theme('colors.transparent')}`,
        '&:focus-visible': {
          backgroundColor: 'var(--tw-btn-accent)',
          borderColor: 'var(--tw-btn-color)',
        },
        '@media (hover)': {
          '&:hover': {
            backgroundColor: 'var(--tw-btn-accent)',
            borderColor: 'var(--tw-btn-color)',
          },
        },
      },
      '&-contur': {
        border: '1px solid var(--tw-btn-color)',
      },
      '&-light': {
        '--tw-btn-hovered': getAlpha('colors.white.DEFAULT'),
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
          backgroundColor: 'var(--tw-btn-color)',
        },
        '@media (hover)': {
          '&:hover': {
            color: 'var(--tw-btn-accent)',
            backgroundColor: theme('colors.transparent'),
            '&::before': {
              left: '0',
              width: '100%',
            },
          },
        },
      },
    },
  })
  matchComponents(
    {
      btn: (color: string | (({}) => string)): BtnColor => {
        if (typeof color === 'function') {
          const value: string = color({})
          const parsed: Color = parseColor(value)

          return {
            '--tw-btn-color': value,
            '--tw-btn-fade': formatColor({
              mode: 'rgba',
              color: parsed.color,
              alpha: opacityValue.fade,
            } as Color),
            '--tw-btn-focus': formatColor({
              mode: 'rgba',
              color: parsed.color,
              alpha: opacityValue.focus,
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
      btn: (constant: number): BtnSize => {
        return {
          '--tw-btn-size': `${constant / 16}rem`,
          borderRadius: String(theme('borderRadius.md')),
          height: 'var(--tw-btn-size)',
          paddingInline: `calc(var(--tw-btn-size) / 2)`,
        }
      },
    },
    {
      values: theme('constants'),
    }
  )
})
