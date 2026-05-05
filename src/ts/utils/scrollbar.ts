import { touchDevice } from '@utils/touch-device'

const className: string[] = ['overflow-hidden']

export const scrollbarShow = (): void => {
  const html = document.documentElement as HTMLHtmlElement

  if (!touchDevice()) html.style.marginRight = '0'

  html.classList.remove(...className)
}

export const scrollbarHidden = (): void => {
  const html = document.documentElement as HTMLHtmlElement
  const scrollbarWidth: number = window.innerWidth - html.clientWidth

  if (!touchDevice()) html.style.marginRight = `${scrollbarWidth}px`

  html.classList.add(...className)
}
