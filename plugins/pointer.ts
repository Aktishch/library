import plugin from 'tailwindcss/plugin'
import { PluginAPI } from 'tailwindcss/types/config'

module.exports = plugin(({ addVariant }: PluginAPI): void => {
  addVariant('pointer-coarse', '@media (pointer: coarse)')
  addVariant('pointer-fine', '@media (pointer: fine)')
})
