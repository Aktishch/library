import { Container, getData, hideScrollbar, isEn, logError, showScrollbar } from '@utils'

interface Coordinates {
  top: number
  left: number
}

const DATA_DRAGGABLE = getData('draggable')

export default (container: Container = document) => {
  const draggables = container.querySelectorAll<HTMLElement>(`*[${DATA_DRAGGABLE}]`)

  if (!draggables.length) return

  draggables.forEach((draggable) => {
    const value = draggable.dataset.draggable

    if (!value) {
      logError(isEn ? `${DATA_DRAGGABLE} is missing a value` : `У ${DATA_DRAGGABLE} отсутствует значение`)
      return
    }

    const coordinates: Coordinates = JSON.parse(sessionStorage.getItem(value) || JSON.stringify({ top: 0, left: 0 }))
    let isActive = false
    let currentY: number
    let currentX: number
    let initialY: number
    let initialX: number

    const setPosition = () => {
      const item = (draggable.closest(`[${DATA_DRAGGABLE}-parent=${value}]`) as HTMLElement | null) || draggable

      item.style.transform = `translate(${coordinates.left}px, ${coordinates.top}px)`
    }

    const getClientCoordinates = (event: TouchEvent | MouseEvent) => {
      return {
        top: 'touches' in event ? event.touches[0].clientY : event.clientY,
        left: 'touches' in event ? event.touches[0].clientX : event.clientX
      }
    }

    const onStart = (event: TouchEvent | MouseEvent) => {
      if (event.target === draggable) {
        hideScrollbar()
        isActive = true
        initialY = getClientCoordinates(event).top - coordinates.top
        initialX = getClientCoordinates(event).left - coordinates.left
      }
    }

    const onMove = (event: TouchEvent | MouseEvent) => {
      if (!isActive) return

      if (event.cancelable) {
        event.preventDefault()
      }

      currentY = getClientCoordinates(event).top - initialY
      currentX = getClientCoordinates(event).left - initialX
      coordinates.top = currentY
      coordinates.left = currentX
      setPosition()
      sessionStorage.setItem(value, JSON.stringify(coordinates))
    }

    const onEnd = () => {
      if (!isActive) return

      showScrollbar()
      initialX = currentX
      initialY = currentY
      isActive = false
    }

    setPosition()
    container.addEventListener('mousedown', onStart as EventListener)
    container.addEventListener('touchstart', onStart as EventListener, { passive: false })
    container.addEventListener('mousemove', onMove as EventListener)
    container.addEventListener('touchmove', onMove as EventListener, { passive: false })
    container.addEventListener('mouseup', onEnd)
    container.addEventListener('mouseleave', onEnd)
    container.addEventListener('touchend', onEnd, { passive: true })
    container.addEventListener('touchcancel', onEnd, { passive: true })
  })
}
