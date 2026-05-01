import { Container, Coordinates, touchDevice } from '@utils'

const setMovement = (event: MouseEvent): void => {
  const item = (event.target as HTMLElement).closest('[data-movement]') as HTMLElement
  const coordinates: Coordinates = {
    top: event.clientY - item.getBoundingClientRect().top,
    left: event.clientX - item.getBoundingClientRect().left,
  }

  item.style.setProperty('--y', `${coordinates.top}px`)
  item.style.setProperty('--x', `${coordinates.left}px`)
}

export default (container: Container = document): void => {
  if (touchDevice()) return

  const movements = container.querySelectorAll('*[data-movement]') as NodeListOf<HTMLElement>

  movements.forEach((movement: HTMLElement): void => {
    if (!movement) return

    movement.classList.add('movement')
    movement.addEventListener('mouseover', setMovement as EventListener)
    movement.addEventListener('mousemove', setMovement as EventListener)
  })
}
