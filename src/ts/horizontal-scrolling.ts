import { media } from '@plugins'
import { getScrollPosition, html } from '@utils'

const setScrollingHeight = (): void => {
  const scrollings = document.querySelectorAll('*[data-scrolling]') as NodeListOf<HTMLElement>

  scrollings.forEach((scrolling: HTMLElement): void => {
    if (!scrolling) return

    const horizontal = scrolling.querySelector('*[data-scrolling-horizontal]') as HTMLDivElement
    const height: number = horizontal.scrollWidth - horizontal.clientWidth

    scrolling.style.setProperty('--scroll-height', `${height}px`)
  })
}

const initHorizontalScroll = (): void => {
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
  if (html.clientWidth < media.md) {
    document.removeEventListener('wheel', initHorizontalScroll as EventListener)
    document.removeEventListener('scroll', initHorizontalScroll as EventListener)
  } else {
    document.addEventListener('wheel', initHorizontalScroll as EventListener, { passive: true })
    document.addEventListener('scroll', initHorizontalScroll as EventListener, { passive: true })
  }
}

export default (): void => {
  setScrollingHeight()
  initHorizontalScroll()
  setBreakpoint()
  window.addEventListener('resize', setScrollingHeight as EventListener)
  window.addEventListener('resize', setBreakpoint as EventListener)
}
