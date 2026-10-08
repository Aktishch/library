import { getData, getTouchDevice } from '@utils'

interface WavedOptions {
  clientY: number
  clientX: number
}

const DATA_WAVED = getData('waved')
const WAVED_CLASSNAME = 'waved'
const WAVED_CIRCLE_CLASSNAME = 'waved-circle'

const setWaved = (event: Event) => {
  const item: HTMLElement | null = (event.target as HTMLElement).closest(`[${DATA_WAVED}]`)

  if (!item) return

  const waved = document.createElement('div')
  const circle = document.createElement('div')

  const createWavedCircle = ({ clientY, clientX }: WavedOptions) => {
    const { top, left } = item.getBoundingClientRect()

    const removeWaved = () => {
      waved.remove()
    }

    circle.classList.add(WAVED_CIRCLE_CLASSNAME)
    circle.style.top = `${clientY - top}px`
    circle.style.left = `${clientX - left}px`
    waved.classList.add(WAVED_CLASSNAME)
    waved.appendChild(circle)
    item.appendChild(waved)
    circle.addEventListener('animationend', removeWaved, { once: true })
  }

  switch (event.type) {
    case 'touchstart': {
      if (!getTouchDevice()) return

      const { clientY, clientX } = (event as TouchEvent).touches[0]

      createWavedCircle({ clientY, clientX })
      break
    }

    case 'mousedown': {
      if (getTouchDevice()) return

      const { clientY, clientX } = event as MouseEvent

      createWavedCircle({ clientY, clientX })
      break
    }
  }
}

export default (container: Document | HTMLElement = document) => {
  container.addEventListener('touchstart', setWaved, { passive: true })
  container.addEventListener('mousedown', setWaved)
}
