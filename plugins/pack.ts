import plugin from 'tailwindcss/plugin'
import { CSSRuleObject, PluginAPI } from 'tailwindcss/types/config'
import { TailwindPlugin } from './plugin'

export const pack: TailwindPlugin = plugin(({ addComponents, matchComponents, theme }: PluginAPI): void => {
  addComponents({
    '.pack': {
      display: 'block',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: theme('content.auto'),
        display: 'block',
        paddingTop: 'var(--tw-pack-size)'
      },
      '&-image': {
        transitionProperty: 'transform',
        transitionDuration: '300ms',
        transitionTimingFunction: 'linear'
      },
      '@media (hover)': {
        '&:hover &-image': {
          transform: 'scale(1.1)'
        }
      }
    }
  })
  matchComponents(
    {
      pack: (size: string | number): CSSRuleObject => {
        return { '--tw-pack-size': `${size}%` }
      }
    },
    {
      values: {
        none: 0,
        xs: 50,
        sm: 60,
        md: 75,
        lg: 90,
        xl: 100,
        xxl: 125
      }
    }
  )
})
