import { Container, Coordinates, getData, hideScrollbar, showScrollbar } from '@utils'

interface Translate {
  item: HTMLElement
  positionX: number
  positionY: number
}

interface ClientCoordinates {
  y: number
  x: number
}

const DATA_DRAGGABLE: string = getData('draggable')

const setTranslate = ({ item, positionX, positionY }: Translate): void => {
  item.style.transform = `translate(${positionX}px, ${positionY}px)`
}

export default (container: Container = document): void => {
  const draggables = container.querySelectorAll(`*[${DATA_DRAGGABLE}]`) as NodeListOf<HTMLElement>

  if (!draggables.length) return

  draggables.forEach((draggable: HTMLElement): void => {
    const value: string | undefined = draggable.dataset.draggable

    if (!value) return

    const coordinates: Coordinates = JSON.parse(sessionStorage.getItem(value) || JSON.stringify({ top: 0, left: 0 }))
    let isActive: boolean = false
    let currentY: number
    let currentX: number
    let initialY: number
    let initialX: number

    const setPosition = (): void => {
      setTranslate({
        item: (draggable.closest(`[${DATA_DRAGGABLE}-parent=${value}]`) as HTMLElement) || draggable,
        positionX: coordinates.left,
        positionY: coordinates.top
      })
    }

    const getClientCoordinates = (event: Event): ClientCoordinates => {
      return {
        y: 'touches' in event ? (event as TouchEvent).touches[0].clientY : (event as MouseEvent).clientY,
        x: 'touches' in event ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX
      }
    }

    const onStart = (event: Event): void => {
      if (event.target === draggable) {
        hideScrollbar()
        isActive = true
        initialY = getClientCoordinates(event).y - coordinates.top
        initialX = getClientCoordinates(event).x - coordinates.left
      }
    }

    const onMove = (event: Event): void => {
      if (!isActive) return

      if (event.cancelable) {
        event.preventDefault()
      }

      currentY = getClientCoordinates(event).y - initialY
      currentX = getClientCoordinates(event).x - initialX
      coordinates.top = currentY
      coordinates.left = currentX
      setPosition()
      sessionStorage.setItem(value, JSON.stringify(coordinates))
    }

    const onEnd = (): void => {
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
    container.addEventListener('mouseup', onEnd as EventListener)
    container.addEventListener('mouseleave', onEnd as EventListener)
    container.addEventListener('touchend', onEnd as EventListener, { passive: true })
    container.addEventListener('touchcancel', onEnd as EventListener, { passive: true })
  })
}
