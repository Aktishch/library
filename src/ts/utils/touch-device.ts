export const touchDevice = (): boolean => {
  return 'ontouchstart' in window || window.navigator.maxTouchPoints > 0
}
