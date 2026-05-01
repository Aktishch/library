import { Container, Coordinates, scrollbarHidden, scrollbarShow } from '@utils'

interface Draggable {
  item: HTMLButtonElement | HTMLDivElement
  positionX: number
  positionY: number
}

const setTranslateDraggable = ({ item, positionX, positionY }: Draggable): void => {
  item.style.transform = `translate(${positionX}px, ${positionY}px)`
}

const setDraggable = (id: string, container: Container = document): void => {
  const draggable = container.querySelector(`#${id}`) as HTMLButtonElement

  if (!draggable) return

  const body = document.body as HTMLBodyElement
  const coordinates: Coordinates = { top: 0, left: 0 }
  let active: boolean = false
  let currentY: number
  let currentX: number
  let initialY: number
  let initialX: number

  const getDragPosition = (): void => {
    setTranslateDraggable({
      item: (draggable.closest('[data-draggable]') as HTMLDivElement) || draggable,
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
    sessionStorage.setItem(`${id}`, JSON.stringify(coordinates))
  }

  if (sessionStorage.getItem(`${id}`)) {
    coordinates.top = JSON.parse(sessionStorage.getItem(`${id}`) || '{}').top
    coordinates.left = JSON.parse(sessionStorage.getItem(`${id}`) || '{}').left
    getDragPosition()
  }

  draggable.addEventListener('touchstart', scrollbarHidden as EventListener)
  draggable.addEventListener('touchend', scrollbarShow as EventListener)
  draggable.addEventListener('mousedown', scrollbarHidden as EventListener)
  draggable.addEventListener('mouseup', scrollbarShow as EventListener)
  body.addEventListener('touchstart', dragStart as EventListener)
  body.addEventListener('touchmove', dragMove as EventListener)
  body.addEventListener('touchend', dragEnd as EventListener)
  body.addEventListener('mousedown', dragStart as EventListener)
  body.addEventListener('mousemove', dragMove as EventListener)
  body.addEventListener('mouseup', dragEnd as EventListener)
}

export default (): void => setDraggable('draggable')
