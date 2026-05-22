import { Coordinates } from '@utils/types'

export const getScrollPosition = (): Coordinates => ({
  top: window.scrollY ?? 0,
  left: window.scrollX ?? 0
})
