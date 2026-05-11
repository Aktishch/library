export const getTouchDevice = (): boolean => {
  return 'ontouchstart' in window || window.navigator.maxTouchPoints > 0
}
