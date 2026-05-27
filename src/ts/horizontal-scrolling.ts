import { media } from '@plugins'
import { Breakpoint, Container, getData, html, isEn, logError } from '@utils'

const DATA_SCROLLING: string = getData('scrolling')

const setError = (): void => {
  return logError(
    isEn
      ? `The ${DATA_SCROLLING} does not have a ${DATA_SCROLLING}-horizontal child element`
      : `У ${DATA_SCROLLING} отсутствует дочерний элемент ${DATA_SCROLLING}-horizontal`
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

  scrollings.forEach((scrolling: HTMLElement): void => {
    const horizontal: HTMLDivElement | null = scrolling.querySelector(`*[${DATA_SCROLLING}-horizontal]`)

    if (!horizontal) {
      return setError()
    }

    const images: NodeListOf<HTMLImageElement> = scrolling.querySelectorAll(`*[${DATA_SCROLLING}-image]`)
    let isIntersecting: boolean = false

    const getBreakpoint = (): boolean => {
      return (
        html.clientWidth <
        (scrolling.hasAttribute('data-breakpoint') ? media[scrolling.dataset.breakpoint as Breakpoint] : media.md)
      )
    }

    const resizeObserver: ResizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]): void => {
      entries.forEach((entry: ResizeObserverEntry): void => {
        const scrolling: HTMLElement = entry.target as HTMLElement
        const horizontal: HTMLDivElement | null = scrolling.querySelector(`*[${DATA_SCROLLING}-horizontal]`)

        if (!horizontal) {
          return setError()
        }

        window.requestAnimationFrame((): void => {
          if (getBreakpoint()) {
            scrolling.style.removeProperty('height')
          } else {
            scrolling.style.height = `${horizontal.scrollWidth - horizontal.clientWidth + window.innerHeight}px`
          }
        })
      })
    })

    const handleScroll = (): void => {
      if (!isIntersecting || getBreakpoint()) return

      const maxScroll: number = horizontal.scrollWidth - horizontal.clientWidth

      window.requestAnimationFrame((): void => {
        horizontal.scrollLeft = -scrolling.getBoundingClientRect().top

        if (maxScroll > 0) {
          const moving: number = (horizontal.scrollLeft / maxScroll) * 10

          images.forEach((image: HTMLImageElement): void => {
            if (!image) return

            image.style.transform = `scale(1.5) translateX(-${moving}%)`
          })
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
