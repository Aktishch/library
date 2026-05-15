import { html } from '@utils/html'
import { Coordinates } from '@utils/types'

export const getScrollPosition = (): Coordinates => {
  return {
    top: (window && window.scrollY && window.self.pageYOffset) || (html && html.scrollTop),
    left: (window && window.scrollX && window.self.pageXOffset) || (html && html.scrollLeft),
  } as Coordinates
}
