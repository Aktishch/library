import { getData, hideScrollbar, isEn, logError, showScrollbar } from '@utils'

const DATA_COMPARE = getData('compare')

const resizeObserver = new ResizeObserver((entries) => {
  if (!entries.length) return

  entries.forEach((entry) => {
    const compare = entry.target as HTMLDivElement
    const image: HTMLImageElement | null = compare.querySelector(`*[${DATA_COMPARE}-image]`)

    if (image) {
      window.requestAnimationFrame(() => {
        image.style.width = `${entry.contentRect.width}px`
      })
    }
  })
})

export default (container: Document | HTMLElement = document) => {
  const compares = container.querySelectorAll<HTMLDivElement>(`*[${DATA_COMPARE}]`)

  if (!compares.length) return

  compares.forEach((compare) => {
    const before: HTMLDivElement | null = compare.querySelector(`*[${DATA_COMPARE}-before]`)
    const change: HTMLDivElement | null = compare.querySelector(`*[${DATA_COMPARE}-change]`)

    if (!before || !change) {
      logError(
        isEn
          ? `The ${DATA_COMPARE} does not have a ${DATA_COMPARE}-(before, change) child element`
          : `У ${DATA_COMPARE} отсутствует дочерний элемент ${DATA_COMPARE}-(before, change)`
      )
      return
    }

    let isActive = false

    const updatePosition = (clientX: number) => {
      const { left, width } = compare.getBoundingClientRect()
      const value = Math.max(0, Math.min(clientX - left, width))

      before.style.width = `${value}px`
      change.style.left = `${value}px`
    }

    const onStart = (event: Event) => {
      if ((event.target as HTMLElement).closest(`[${DATA_COMPARE}-change]`)) {
        hideScrollbar()
        isActive = true
      }
    }

    const onMove = (event: TouchEvent | MouseEvent) => {
      if (!isActive) return

      if (event.cancelable) {
        event.preventDefault()
      }

      updatePosition('touches' in event ? event.touches[0].clientX : event.clientX)
    }

    const onEnd = () => {
      if (!isActive) return

      showScrollbar()
      isActive = false
    }

    resizeObserver.observe(compare)
    container.addEventListener('mousedown', onStart)
    container.addEventListener('touchstart', onStart, { passive: false })
    container.addEventListener('mousemove', onMove as EventListener)
    container.addEventListener('touchmove', onMove as EventListener, { passive: false })
    container.addEventListener('mouseup', onEnd)
    container.addEventListener('mouseleave', onEnd)
    container.addEventListener('touchend', onEnd, { passive: true })
    container.addEventListener('touchcancel', onEnd, { passive: true })
  })
}
