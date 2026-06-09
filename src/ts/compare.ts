import { Container, getData, hideScrollbar, isEn, logError, showScrollbar } from '@utils'

type Image = HTMLImageElement | null
type Before = HTMLDivElement | null
type Change = HTMLDivElement | null

const DATA_COMPARE: string = getData('compare')

const handleElementsError = (): void => {
  logError(
    isEn
      ? `The ${DATA_COMPARE} does not have a ${DATA_COMPARE}-(before, change) child element`
      : `У ${DATA_COMPARE} отсутствует дочерний элемент ${DATA_COMPARE}-(before, change)`
  )
}

const resizeObserver: ResizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]): void => {
  if (!entries.length) return

  entries.forEach((entry: ResizeObserverEntry): void => {
    const compare: HTMLDivElement = entry.target as HTMLDivElement
    const image: Image = compare.querySelector(`*[${DATA_COMPARE}-image]`)

    if (image) {
      window.requestAnimationFrame((): void => {
        image.style.width = `${entry.contentRect.width}px`
      })
    }
  })
})

export default (container: Container = document): void => {
  const compares: NodeListOf<HTMLDivElement> = container.querySelectorAll(`*[${DATA_COMPARE}]`)

  if (!compares.length) return

  compares.forEach((compare: HTMLDivElement): void => {
    const before: Before = compare.querySelector(`*[${DATA_COMPARE}-before]`)
    const change: Change = compare.querySelector(`*[${DATA_COMPARE}-change]`)

    if (!before || !change) {
      handleElementsError()
      return
    }

    let isActive: boolean = false

    const updatePosition = (pageX: number): void => {
      const rect: DOMRect = compare.getBoundingClientRect()
      const value: number = Math.max(0, Math.min(pageX - rect.left, rect.width))

      before.style.width = `${value}px`
      change.style.left = `${value}px`
    }

    const onStart = (event: Event): void => {
      if ((event.target as HTMLElement).closest(`[${DATA_COMPARE}-change]`)) {
        hideScrollbar()
        isActive = true
      }
    }

    const onMove = (event: TouchEvent | MouseEvent): void => {
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
    container.addEventListener('mousedown', onStart as EventListener)
    container.addEventListener('touchstart', onStart as EventListener, { passive: false })
    container.addEventListener('mousemove', onMove as EventListener)
    container.addEventListener('touchmove', onMove as EventListener, { passive: false })
    container.addEventListener('mouseup', onEnd as EventListener)
    container.addEventListener('mouseleave', onEnd as EventListener)
    container.addEventListener('touchend', onEnd as EventListener, { passive: true })
    container.addEventListener('touchcancel', onEnd as EventListener, { passive: true })
  })
}
