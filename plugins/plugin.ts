import { Config, PluginCreator } from 'tailwindcss/types/config'

export interface TailwindPlugin {
  handler: PluginCreator
  config?: Partial<Config>
}

const value: string = '<alpha-value>'

export const getColor = (variable: string): string => {
  return `rgba(var(--color-${variable}), ${value})`
}

export const getRgba = (color: string, alpha: string = '1'): string => {
  return color.replace(value, alpha)
}
