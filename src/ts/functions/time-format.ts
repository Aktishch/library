export const timeFormat = (value: number): string => {
  return value < 10 || value === 0 ? `0${value}` : `${value}`
}
