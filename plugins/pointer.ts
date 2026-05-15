import plugin from 'tailwindcss/plugin'
import { PluginAPI } from 'tailwindcss/types/config'
import { TailwindPlugin } from './plugin'

export const pointer: TailwindPlugin = plugin(({ addVariant }: PluginAPI): void => {
  addVariant('pointer-coarse', '@media (pointer: coarse)')
  addVariant('pointer-fine', '@media (pointer: fine)')
})
