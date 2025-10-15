import plugin from 'tailwindcss/plugin'
import { PluginAPI } from 'tailwindcss/types/config'

type PackSize = {
  '--tw-pack-size': string
}

module.exports = plugin(({ addComponents, matchComponents, theme }: PluginAPI): void => {
  addComponents({
    '.pack': {
      display: 'block',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: theme('content.auto'),
        display: 'block',
        paddingTop: 'var(--tw-pack-size)',
      },
      '&-image': {
        transitionProperty: 'transform',
        transitionDuration: '300ms',
        transitionTimingFunction: 'linear',
      },
      '@media (hover)': {
        '&:hover &-image': {
          transform: 'scale(1.1)',
        },
      },
    },
  })
  matchComponents(
    {
      pack: (size: number): PackSize => {
        return { '--tw-pack-size': `${size}%` }
      },
    },
    {
      values: {
        xs: 50,
        sm: 60,
        md: 75,
        lg: 90,
        xl: 100,
        xxl: 125,
      },
    }
  )
})
