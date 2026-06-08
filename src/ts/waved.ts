import { Container, Coordinates, getTouchDevice } from '@utils'

type WavedItem = HTMLElement | null

interface CirclePoisition {
  positionY: number
  positionX: number
}

const setWaved = (event: Event): void => {
  const item: WavedItem = (event.target as HTMLElement).closest('[data-waved]')

  if (!item) return

  const waved: HTMLDivElement = document.createElement('div')
  const circle: HTMLDivElement = document.createElement('div')

  const createWavedCircle = ({ positionY, positionX }: CirclePoisition): void => {
    const coordinates: Coordinates = {
      top: positionY - item.getBoundingClientRect().top,
      left: positionX - item.getBoundingClientRect().left
    }

    const removeWaved = (): void => {
      waved.remove()
    }

    circle.classList.add('waved-circle')
    circle.style.top = `${coordinates.top}px`
    circle.style.left = `${coordinates.left}px`
    waved.classList.add('waved')
    waved.appendChild(circle)
    item.appendChild(waved)
    circle.addEventListener('animationend', removeWaved as EventListener, { once: true })
  }

  switch (event.type) {
    case 'touchstart': {
      if (!getTouchDevice()) return

      createWavedCircle({
        positionY: (event as TouchEvent).touches[0].clientY,
        positionX: (event as TouchEvent).touches[0].clientX
      })

      break
    }

    case 'mousedown': {
      if (getTouchDevice()) return

      createWavedCircle({
        positionY: (event as MouseEvent).clientY,
        positionX: (event as MouseEvent).clientX
      })

      break
    }
  }
}

export default (container: Container = document): void => {
  container.addEventListener('touchstart', setWaved as EventListener, { passive: true })
  container.addEventListener('mousedown', setWaved as EventListener)
}
