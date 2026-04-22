const value: string = '<alpha-value>'

export interface Color {
  mode: 'rgba'
  color: string[]
  alpha: string
}

export const createColor = (variable: string): string => {
  return `rgba(var(--color-${variable}), ${value})`
}

export const getRGB = (color: string, alpha: string = '1'): string => {
  return color.replace(value, alpha)
}
