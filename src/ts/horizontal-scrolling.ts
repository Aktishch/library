import { media } from '@plugins'
import { Breakpoint, Container, DATA_BREAKPOINT, getData, html, isEn, logError } from '@utils'

type Horizontal = HTMLDivElement | null

const DATA_SCROLLING: string = getData('scrolling')

const handleHorizontalError = (): void => {
  logError(
    isEn
      ? `The ${DATA_SCROLLING} does not have a ${DATA_SCROLLING}-horizontal child element`
      : `У ${DATA_SCROLLING} отсутствует дочерний элемент ${DATA_SCROLLING}-horizontal`
  )
}

const getBreakpoint = (scrolling: HTMLElement): boolean => {
  return (
    html.clientWidth <
    (scrolling.hasAttribute(DATA_BREAKPOINT) ? media[scrolling.dataset.breakpoint as Breakpoint] : media.md)
  )
}

export default (container: Container = document): void => {
  const scrollings: NodeListOf<HTMLElement> = container.querySelectorAll(`*[${DATA_SCROLLING}]`)

  if (!scrollings.length) return

  const options: IntersectionObserverInit = {
    root: container === document ? null : container,
    rootMargin: '0px',
    threshold: 0
  }

  const resizeObserver: ResizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]): void => {
    entries.forEach((entry: ResizeObserverEntry): void => {
      const scrolling: HTMLElement = entry.target as HTMLElement
      const horizontal: Horizontal = scrolling.querySelector(`*[${DATA_SCROLLING}-horizontal]`)

      if (!horizontal) {
        return handleHorizontalError()
      }

      window.requestAnimationFrame((): void => {
        if (getBreakpoint(scrolling)) {
          scrolling.style.removeProperty('height')
        } else {
          scrolling.style.height = `${horizontal.scrollWidth - horizontal.clientWidth + window.innerHeight}px`
        }
      })
    })
  })

  scrollings.forEach((scrolling: HTMLElement): void => {
    const horizontal: Horizontal = scrolling.querySelector(`*[${DATA_SCROLLING}-horizontal]`)

    if (!horizontal) {
      return handleHorizontalError()
    }

    const images: NodeListOf<HTMLImageElement> = scrolling.querySelectorAll(`*[${DATA_SCROLLING}-image]`)
    let isIntersecting: boolean = false

    const handleScroll = (): void => {
      if (!isIntersecting || getBreakpoint(scrolling)) return

      const maxScroll: number = horizontal.scrollWidth - horizontal.clientWidth

      window.requestAnimationFrame((): void => {
        horizontal.scrollLeft = -scrolling.getBoundingClientRect().top

        if (maxScroll > 0) {
          const moving: number = (horizontal.scrollLeft / maxScroll) * 10

          if (images.length) {
            images.forEach((image: HTMLImageElement): void => {
              image.style.transform = `scale(1.5) translateX(-${moving}%)`
            })
          }
        }
      })
    }

    const callback = (entries: IntersectionObserverEntry[]): void => {
      entries.forEach((entry: IntersectionObserverEntry): void => {
        isIntersecting = entry.isIntersecting
      })
    }

    const observer: IntersectionObserver = new IntersectionObserver(callback, options)

    resizeObserver.observe(scrolling)
    observer.observe(scrolling)
    container.addEventListener('scroll', handleScroll as EventListener, { passive: true })
  })
}
