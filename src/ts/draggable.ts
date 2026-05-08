import { Container, Coordinates, scrollbarHidden, scrollbarShow } from '@utils'

interface Draggable {
  item: HTMLElement
  positionX: number
  positionY: number
}

const setTranslateDraggable = ({ item, positionX, positionY }: Draggable): void => {
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

    const getDragPosition = (): void => {
      setTranslateDraggable({
        item: (draggable.closest(`[data-draggable-parent=${value}]`) as HTMLElement) || draggable,
        positionX: coordinates.left,
        positionY: coordinates.top,
      })
    }

    const dragStart = (event: Event): void => {
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

    const dragEnd = (): void => {
      initialX = currentX
      initialY = currentY
      active = false
    }

    const dragMove = (event: Event): void => {
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
      getDragPosition()
      sessionStorage.setItem(value, JSON.stringify(coordinates))
    }

    getDragPosition()

    draggable.addEventListener('touchstart', scrollbarHidden as EventListener, { passive: true })
    draggable.addEventListener('touchend', scrollbarShow as EventListener, { passive: true })
    draggable.addEventListener('touchcancel', scrollbarShow as EventListener, { passive: true })
    draggable.addEventListener('mousedown', scrollbarHidden as EventListener)
    draggable.addEventListener('mouseup', scrollbarShow as EventListener)
    draggable.addEventListener('mouseleave', scrollbarShow as EventListener)
    container.addEventListener('touchstart', dragStart as EventListener, { passive: true })
    container.addEventListener('touchend', dragEnd as EventListener, { passive: true })
    container.addEventListener('touchcancel', dragEnd as EventListener, { passive: true })
    container.addEventListener('touchmove', dragMove as EventListener, { passive: true })
    container.addEventListener('mousedown', dragStart as EventListener)
    container.addEventListener('mouseup', dragEnd as EventListener)
    container.addEventListener('mouseleave', dragEnd as EventListener)
    container.addEventListener('mousemove', dragMove as EventListener)
  })
}
