import { Coordinates, getTouchDevice } from '@utils'

interface CreateWaved {
  positionY: number
  positionX: number
}

const setWaved = (event: Event): void => {
  const item = event.target as HTMLElement

  if (item.closest('[data-waved]')) {
    const waved = document.createElement('div') as HTMLDivElement
    const circle = document.createElement('div') as HTMLDivElement

    const createWaved = ({ positionY, positionX }: CreateWaved): void => {
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
        if (!getTouchDevice()) return

        createWaved({
          positionY: (event as TouchEvent).touches[0].clientY,
          positionX: (event as TouchEvent).touches[0].clientX,
        })

        break
      }

      case 'mousedown': {
        if (getTouchDevice()) return

        createWaved({
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
