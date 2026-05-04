import { Coordinates, touchDevice } from '@utils'

interface WavedCircle {
  positionY: number
  positionX: number
}

const setWaved = (event: Event): void => {
  if ((event.target as HTMLElement).closest('[data-waved]')) {
    const item = (event.target as HTMLElement).closest('[data-waved]') as HTMLElement

    const waved = document.createElement('div') as HTMLDivElement
    const circle = document.createElement('div') as HTMLDivElement

    const createCircle = ({ positionY, positionX }: WavedCircle): void => {
      const coordinates: Coordinates = {
        top: positionY - item.getBoundingClientRect().top,
        left: positionX - item.getBoundingClientRect().left,
      }

      circle.classList.add('waved-circle')
      circle.style.top = `${coordinates.top}px`
      circle.style.left = `${coordinates.left}px`
      waved.classList.add('waved')
      waved.appendChild(circle)
      item.appendChild(waved)
      setTimeout((): void => waved.remove(), 1000)
    }

    switch (event.type) {
      case 'touchstart': {
        if (!touchDevice()) return

        createCircle({
          positionY: (event as TouchEvent).touches[0].clientY,
          positionX: (event as TouchEvent).touches[0].clientX,
        })

        break
      }

      case 'mousedown': {
        if (touchDevice()) return

        createCircle({
          positionY: (event as MouseEvent).clientY,
          positionX: (event as MouseEvent).clientX,
        })

        break
      }
    }
  }
}

export default (): void => {
  document.addEventListener('touchstart', setWaved as EventListener, { passive: true })
  document.addEventListener('mousedown', setWaved as EventListener)
}
