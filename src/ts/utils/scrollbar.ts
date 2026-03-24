import { touchDevice } from './touch-device'

const className: string[] = ['overflow-hidden']

export const scrollbarShow = (): void => {
  const html = document.documentElement as HTMLHtmlElement
  const smoothScroll = document.querySelector('#smooth-scroll') as HTMLDivElement

  if (!touchDevice()) smoothScroll ? (smoothScroll.style.right = '0') : (html.style.marginRight = '0')

  html.classList.remove(...className)
}

export const scrollbarHidden = (): void => {
  const html = document.documentElement as HTMLHtmlElement
  const smoothScroll = document.querySelector('#smooth-scroll') as HTMLDivElement
  const scrollbarWidth: number = window.innerWidth - html.clientWidth

  if (!touchDevice())
    smoothScroll ? (smoothScroll.style.right = `${scrollbarWidth}px`) : (html.style.marginRight = `${scrollbarWidth}px`)

  html.classList.add(...className)
}
