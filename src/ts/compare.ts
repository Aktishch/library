import { Container, hideScrollbar, showScrollbar } from '@utils'

const DATA_COMPARE: string = 'data-compare'

export default (container: Container = document): void => {
  const compares = container.querySelectorAll(`*[${DATA_COMPARE}]`) as NodeListOf<HTMLDivElement>

  if (compares.length === 0) return

  const resizeObserver: ResizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]): void => {
    entries.forEach((entry: ResizeObserverEntry): void => {
      const compare = entry.target as HTMLDivElement
      const image = compare.querySelector(`*[${DATA_COMPARE}-image]`) as HTMLImageElement

      if (image) {
        image.style.width = `${entry.contentRect.width}px`
      }
    })
  })

  compares.forEach((compare: HTMLDivElement): void => {
    if (!compare) return

    const before = compare.querySelector(`*[${DATA_COMPARE}-before]`) as HTMLDivElement
    const change = compare.querySelector(`*[${DATA_COMPARE}-change]`) as HTMLDivElement
    let isActive: boolean = false

    const updatePosition = (pageX: number): void => {
      const rect: DOMRect = compare.getBoundingClientRect()
      const position: number = pageX - rect.left
      const value: number = Math.max(0, Math.min(position, rect.width))

      before.style.width = `${value}px`
      change.style.left = `${value}px`
    }

    const onStart = (event: Event): void => {
      if ((event.target as HTMLElement).closest(`[${DATA_COMPARE}-change]`)) {
        hideScrollbar()
        isActive = true
      }
    }

    const onMove = (event: MouseEvent | TouchEvent): void => {
      if (!isActive) return

      if (event.cancelable) {
        event.preventDefault()
      }

      updatePosition('touches' in event ? event.touches[0].pageX : event.pageX)
    }

    const onEnd = (): void => {
      if (!isActive) return

      showScrollbar()
      isActive = false
    }

    resizeObserver.observe(compare)

    compare.addEventListener('mousedown', onStart as EventListener)
    compare.addEventListener('touchstart', onStart as EventListener, { passive: false })
    window.addEventListener('mousemove', onMove as EventListener)
    window.addEventListener('touchmove', onMove as EventListener, { passive: false })
    window.addEventListener('mouseup', onEnd as EventListener)
    window.addEventListener('touchend', onEnd as EventListener)
    window.addEventListener('touchcancel', onEnd as EventListener)
  })
}
