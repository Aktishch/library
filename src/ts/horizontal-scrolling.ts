import { media } from '@plugins'
import { Breakpoint, Container, getData, html } from '@utils'

const DATA_SCROLLING: string = getData('scrolling')

export default (container: Container = document): void => {
  const scrollings = container.querySelectorAll(`*[${DATA_SCROLLING}]`) as NodeListOf<HTMLElement>

  if (!scrollings.length) return

  const options: IntersectionObserverInit = {
    root: container === document ? null : container,
    rootMargin: '0px',
    threshold: 0
  }

  scrollings.forEach((scrolling: HTMLElement): void => {
    const horizontal = scrolling.querySelector(`*[${DATA_SCROLLING}-horizontal]`) as HTMLDivElement
    const images = scrolling.querySelectorAll(`*[${DATA_SCROLLING}-image]`) as NodeListOf<HTMLImageElement>
    let isIntersecting: boolean = false

    const getBreakpoint = (): boolean => {
      return (
        html.clientWidth <
        (scrolling.hasAttribute('data-breakpoint') ? media[scrolling.dataset.breakpoint as Breakpoint] : media.md)
      )
    }

    const resizeObserver: ResizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]): void => {
      entries.forEach((entry: ResizeObserverEntry): void => {
        const scrolling = entry.target as HTMLElement
        const horizontal = scrolling.querySelector(`*[${DATA_SCROLLING}-horizontal]`) as HTMLDivElement
        const height: number = horizontal.scrollWidth - horizontal.clientWidth

        window.requestAnimationFrame((): void => {
          if (getBreakpoint()) {
            scrolling.style.removeProperty('height')
          } else {
            scrolling.style.height = `${height + window.innerHeight}px`
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
