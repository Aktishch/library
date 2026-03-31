import { Coordinates, touchDevice } from './utils'

const setMovement = (event: MouseEvent): void => {
  const item = (event.target as HTMLElement).closest('[data-movement]') as HTMLElement
  const coordinates: Coordinates = {
    top: event.clientY - item.getBoundingClientRect().top,
    left: event.clientX - item.getBoundingClientRect().left,
  }

  item.style.setProperty('--y', `${coordinates.top}px`)
  item.style.setProperty('--x', `${coordinates.left}px`)
}

export default (): void => {
  if (touchDevice()) return

  const items = document.querySelectorAll('*[data-movement]') as NodeListOf<HTMLElement>

  items.forEach((item: HTMLElement): void => {
    if (!item) return

    item.classList.add('movement')
    item.addEventListener('mouseover', setMovement as EventListener)
    item.addEventListener('mousemove', setMovement as EventListener)
  })
}
