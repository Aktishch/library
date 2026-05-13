const value: string = '<alpha-value>'

export interface Color {
  mode: 'rgba'
  color: string[]
  alpha: string
}

export const getColor = (variable: string): string => {
  return `rgba(var(--color-${variable}), ${value})`
}

export const getRgba = (color: string, alpha: string = '1'): string => {
  return color.replace(value, alpha)
}
