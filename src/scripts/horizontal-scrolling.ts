import { getData, html, isEn, logError, media } from '@utils'

const DATA_SCROLLING = getData('scrolling')

const handleHorizontalError = () => {
  logError(
    isEn
      ? `The ${DATA_SCROLLING} does not have a ${DATA_SCROLLING}-horizontal child element`
      : `У ${DATA_SCROLLING} отсутствует дочерний элемент ${DATA_SCROLLING}-horizontal`
  )
}

const getBreakpoint = (scrolling: HTMLElement) => {
  const value = scrolling.dataset.breakpoint
  const breakpoint: number = value && value in media ? media[value] : media.md

  return html.clientWidth >= breakpoint
}

const resizeObserver = new ResizeObserver((entries) => {
  if (!entries.length) return

  entries.forEach((entry) => {
    const scrolling = entry.target as HTMLElement
    const horizontal: HTMLDivElement | null = scrolling.querySelector(`*[${DATA_SCROLLING}-horizontal]`)

    if (!horizontal) {
      handleHorizontalError()
      return
    }

    window.requestAnimationFrame(() => {
      if (getBreakpoint(scrolling)) {
        scrolling.style.height = `${horizontal.scrollWidth - horizontal.clientWidth + window.innerHeight}px`
      } else {
        scrolling.style.removeProperty('height')
      }
    })
  })
})

export default (container: Document | HTMLElement = document) => {
  const scrollings = container.querySelectorAll<HTMLElement>(`*[${DATA_SCROLLING}]`)

  if (!scrollings.length) return

  scrollings.forEach((scrolling) => {
    const horizontal: HTMLDivElement | null = scrolling.querySelector(`*[${DATA_SCROLLING}-horizontal]`)

    if (!horizontal) {
      handleHorizontalError()
      return
    }

    const images = scrolling.querySelectorAll<HTMLImageElement>(`*[${DATA_SCROLLING}-image]`)
    let isIntersecting = false

    const handleScroll = () => {
      if (!isIntersecting || !getBreakpoint(scrolling)) return

      const maxScroll = horizontal.scrollWidth - horizontal.clientWidth

      window.requestAnimationFrame(() => {
        horizontal.scrollLeft = -scrolling.getBoundingClientRect().top

        if (maxScroll > 0) {
          const moving = (horizontal.scrollLeft / maxScroll) * 10

          if (images.length) {
            images.forEach((image) => {
              image.style.transform = `scale(1.5) translateX(-${moving}%)`
            })
          }
        }
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting
        })
      },
      {
        root: container === document ? null : container,
        rootMargin: '0px',
        threshold: 0
      }
    )

    resizeObserver.observe(scrolling)
    observer.observe(scrolling)
    container.addEventListener('scroll', handleScroll, { passive: true })
  })
}
