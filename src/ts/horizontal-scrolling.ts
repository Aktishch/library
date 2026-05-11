import { media } from '@plugins/media'
import { getScrollPosition } from '@utils'

const setHorizontalScrollingHeight = (): void => {
  const scrollings = document.querySelectorAll('*[data-scrolling]') as NodeListOf<HTMLElement>

  scrollings.forEach((scrolling: HTMLElement): void => {
    if (!scrolling) return

    const horizontal = scrolling.querySelector('*[data-scrolling-horizontal]') as HTMLDivElement
    const height: number = horizontal.scrollWidth - horizontal.clientWidth

    scrolling.style.setProperty('--scroll-height', `${height}px`)
  })
}

const createHorizontalScrolling = (): void => {
  const scrollings = document.querySelectorAll('*[data-scrolling]') as NodeListOf<HTMLElement>

  scrollings.forEach((scrolling: HTMLElement): void => {
    if (!scrolling) return

    const horizontal = scrolling.querySelector('*[data-scrolling-horizontal]') as HTMLElement
    const images = scrolling.querySelectorAll('*[data-scrolling-image]') as NodeListOf<HTMLImageElement>
    const moving: number = (horizontal.scrollLeft / (horizontal.scrollWidth - horizontal.clientWidth)) * 20

    horizontal.scrollLeft = getScrollPosition().top + horizontal.offsetHeight - scrolling.offsetTop

    images.forEach((image: HTMLImageElement): void => {
      if (image) image.style.setProperty('--scroll-moving', `-${moving}%`)
    })
  })
}

const setBreakpoint = (): void => {
  if ((document.documentElement as HTMLHtmlElement).clientWidth < media.md) {
    document.removeEventListener('wheel', createHorizontalScrolling as EventListener)
    document.removeEventListener('scroll', createHorizontalScrolling as EventListener)
  } else {
    document.addEventListener('wheel', createHorizontalScrolling as EventListener, { passive: true })
    document.addEventListener('scroll', createHorizontalScrolling as EventListener, { passive: true })
  }
}

export default (): void => {
  setHorizontalScrollingHeight()
  createHorizontalScrolling()
  setBreakpoint()
  window.addEventListener('resize', setHorizontalScrollingHeight as EventListener)
  window.addEventListener('resize', setBreakpoint as EventListener)
}
