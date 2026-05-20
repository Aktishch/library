import { getTouchDevice } from '@utils/get-touch-device'
import { html } from '@utils/html'

const SCROLLBAR_HIDDEN_CLASSNAME: string = 'overflow-hidden'

export const showScrollbar = (): void => {
  if (!getTouchDevice()) {
    html.style.removeProperty('margin-right')
  }

  html.classList.remove(SCROLLBAR_HIDDEN_CLASSNAME)
}

export const hideScrollbar = (): void => {
  if (!getTouchDevice()) {
    const scrollbarWidth: number = window.innerWidth - html.clientWidth

    if (scrollbarWidth > 0) {
      html.style.marginRight = `${scrollbarWidth}px`
    }
  }

  html.classList.add(SCROLLBAR_HIDDEN_CLASSNAME)
}
