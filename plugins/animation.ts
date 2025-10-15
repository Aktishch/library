import plugin from 'tailwindcss/plugin'
import { PluginAPI } from 'tailwindcss/types/config'

type Animation = {
  [index: string]: {
    [value: string]: string
  }
}

type AnimationElement = [string, string]

module.exports = plugin(
  ({ addComponents, theme }: PluginAPI): void => {
    let anim: Animation = {
      '.anim': {
        transitionProperty: 'transform, opacity, visibility',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease',
      },
    }
    let clipPath: Animation = {
      '.clip-path': {
        transitionProperty: 'clip-path',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease',
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      },
    }
    Object.entries(theme('anim')).map(([key, value]: AnimationElement): void => {
      anim = {
        ...anim,
        [`.anim-${key}:not([data-anim="show"])`]: {
          transform: `${value}`,
          visibility: 'hidden',
          opacity: '0',
        },
      }
    })
    Object.entries(theme('clipPath')).map(([key, value]: AnimationElement): void => {
      clipPath = {
        ...clipPath,
        [`.clip-path-${key}:not([data-anim="show"])`]: {
          clipPath: `${value}`,
        },
      }
    })
    addComponents(anim)
    addComponents(clipPath)
  },
  {
    theme: {
      anim: {
        fade: 'none',
        increase: 'scale(0)',
        decrease: 'scale(1.3)',
        circle: 'rotate(1turn)',
        up: 'translateY(3.5rem)',
        down: 'translateY(-3.5rem)',
        left: 'translateX(3.5rem)',
        right: 'translateX(-3.5rem)',
      },
      clipPath: {
        up: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
        down: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
        left: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
        right: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
      },
    },
  }
)
