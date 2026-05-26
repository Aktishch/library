import { Config, PluginCreator } from 'tailwindcss/types/config'

export interface TailwindPlugin {
  handler: PluginCreator
  config?: Partial<Config>
}

const ALPHA_VALUE: string = '<alpha-value>'

export const getColor = (variable: string): string => {
  return `rgba(var(--color-${variable}), ${ALPHA_VALUE})`
}

export const getRgba = (color: string, alpha: string = '1'): string => {
  return color.replace(ALPHA_VALUE, alpha)
}
