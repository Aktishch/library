import { Container, Coordinates, hideScrollbar, showScrollbar } from '@utils'

interface SetTranslate {
  item: HTMLElement
  positionX: number
  positionY: number
}

const setTranslate = ({ item, positionX, positionY }: SetTranslate): void => {
  item.style.transform = `translate(${positionX}px, ${positionY}px)`
}

export default (container: Container = document): void => {
  const draggables = container.querySelectorAll('*[data-draggable]') as NodeListOf<HTMLElement>

  draggables.forEach((draggable: HTMLElement): void => {
    if (!draggable || !draggable.dataset.draggable) return

    const value: string = draggable.dataset.draggable
    const coordinates: Coordinates = JSON.parse(sessionStorage.getItem(value) || JSON.stringify({ top: 0, left: 0 }))
    let active: boolean = false
    let currentY: number
    let currentX: number
    let initialY: number
    let initialX: number

    const setDraggablePosition = (): void => {
      setTranslate({
        item: (draggable.closest(`[data-draggable-parent=${value}]`) as HTMLElement) || draggable,
        positionX: coordinates.left,
        positionY: coordinates.top,
      })
    }

    const startDraggable = (event: Event): void => {
      switch (event.type) {
        case 'touchstart': {
          initialY = (event as TouchEvent).touches[0].clientY - coordinates.top
          initialX = (event as TouchEvent).touches[0].clientX - coordinates.left
          break
        }

        case 'mousedown': {
          initialY = (event as MouseEvent).clientY - coordinates.top
          initialX = (event as MouseEvent).clientX - coordinates.left
          break
        }
      }

      if (event.target === draggable) active = true
    }

    const endDraggable = (): void => {
      initialX = currentX
      initialY = currentY
      active = false
    }

    const moveDraggable = (event: Event): void => {
      if (!active) return

      switch (event.type) {
        case 'touchmove': {
          currentX = (event as TouchEvent).touches[0].clientX - initialX
          currentY = (event as TouchEvent).touches[0].clientY - initialY
          break
        }

        case 'mousemove': {
          currentX = (event as MouseEvent).clientX - initialX
          currentY = (event as MouseEvent).clientY - initialY
          break
        }
      }

      coordinates.top = currentY
      coordinates.left = currentX
      setDraggablePosition()
      sessionStorage.setItem(value, JSON.stringify(coordinates))
    }

    setDraggablePosition()

    draggable.addEventListener('touchstart', hideScrollbar as EventListener, { passive: true })
    draggable.addEventListener('touchend', showScrollbar as EventListener, { passive: true })
    draggable.addEventListener('touchcancel', showScrollbar as EventListener, { passive: true })
    draggable.addEventListener('mousedown', hideScrollbar as EventListener)
    draggable.addEventListener('mouseup', showScrollbar as EventListener)
    draggable.addEventListener('mouseleave', showScrollbar as EventListener)
    container.addEventListener('touchstart', startDraggable as EventListener, { passive: true })
    container.addEventListener('touchend', endDraggable as EventListener, { passive: true })
    container.addEventListener('touchcancel', endDraggable as EventListener, { passive: true })
    container.addEventListener('touchmove', moveDraggable as EventListener, { passive: true })
    container.addEventListener('mousedown', startDraggable as EventListener)
    container.addEventListener('mouseup', endDraggable as EventListener)
    container.addEventListener('mouseleave', endDraggable as EventListener)
    container.addEventListener('mousemove', moveDraggable as EventListener)
  })
}
