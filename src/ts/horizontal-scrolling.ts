import { media, scrolledPage } from './utils'

const setScrollingHeight = (): void => {
  const scrollings = document.querySelectorAll('*[data-scrolling]') as NodeListOf<HTMLElement>

  scrollings.forEach((scrolling: HTMLElement): void => {
    if (!scrolling) return

    const horizontal = scrolling.querySelector('*[data-scrolling-horizontal]') as HTMLDivElement
    const height: number = horizontal.scrollWidth - horizontal.clientWidth

    scrolling.style.setProperty('--scroll-height', `${height}px`)
  })
}

const setHorizontalScrolling = (): void => {
  const scrollings = document.querySelectorAll('*[data-scrolling]') as NodeListOf<HTMLElement>

  scrollings.forEach((scrolling: HTMLElement): void => {
    if (!scrolling) return

    const horizontal = scrolling.querySelector('*[data-scrolling-horizontal]') as HTMLElement
    const images = scrolling.querySelectorAll('*[data-scrolling-image]') as NodeListOf<HTMLImageElement>
    const offsetTop: number = scrolledPage().top
    const moving: number = (horizontal.scrollLeft / (horizontal.scrollWidth - horizontal.clientWidth)) * 20

    horizontal.scrollLeft = offsetTop + horizontal.offsetHeight - scrolling.offsetTop

    images.forEach((image: HTMLImageElement): void => {
      if (!image) return

      image.style.setProperty('--scroll-moving', `-${moving}%`)
    })
  })
}

const scrollingInViewport = (): void => {
  if ((document.documentElement as HTMLHtmlElement).clientWidth < media.md) {
    document.removeEventListener('wheel', setHorizontalScrolling as EventListener)
    document.removeEventListener('scroll', setHorizontalScrolling as EventListener)
  } else {
    document.addEventListener('wheel', setHorizontalScrolling as EventListener)
    document.addEventListener('scroll', setHorizontalScrolling as EventListener)
  }
}

export default (): void => {
  setScrollingHeight()
  setHorizontalScrolling()
  scrollingInViewport()
  window.addEventListener('resize', setScrollingHeight as EventListener)
  window.addEventListener('resize', scrollingInViewport as EventListener)
}
