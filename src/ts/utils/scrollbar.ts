import { getTouchDevice } from '@utils/get-touch-device'
import { html } from '@utils/html'

const className: string[] = ['overflow-hidden']

export const showScrollbar = (): void => {
  if (!getTouchDevice()) html.style.marginRight = '0'

  html.classList.remove(...className)
}

export const hideScrollbar = (): void => {
  if (!getTouchDevice()) html.style.marginRight = `${window.innerWidth - html.clientWidth}px`

  html.classList.add(...className)
}
