import { Coordinates } from '@utils/types'

export const scrolledPage = (): Coordinates => {
  return {
    top:
      (window && window.scrollY && window.self.pageYOffset) ||
      (document.documentElement && document.documentElement.scrollTop),
    left:
      (window && window.scrollX && window.self.pageXOffset) ||
      (document.documentElement && document.documentElement.scrollLeft),
  } as Coordinates
}
