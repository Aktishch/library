import { getTouchDevice } from '@utils/get-touch-device'

const className: string[] = ['overflow-hidden']

export const showScrollbar = (): void => {
  const html = document.documentElement as HTMLHtmlElement

  if (!getTouchDevice()) html.style.marginRight = '0'

  html.classList.remove(...className)
}

export const hideScrollbar = (): void => {
  const html = document.documentElement as HTMLHtmlElement
  const scrollbarWidth: number = window.innerWidth - html.clientWidth

  if (!getTouchDevice()) html.style.marginRight = `${scrollbarWidth}px`

  html.classList.add(...className)
}
