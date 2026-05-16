import { Container, Coordinates, getTouchDevice } from '@utils'

const setMovement = (event: MouseEvent): void => {
  const movement = (event.target as HTMLElement).closest('[data-movement]') as HTMLElement
  const coordinates: Coordinates = {
    top: event.clientY - movement.getBoundingClientRect().top,
    left: event.clientX - movement.getBoundingClientRect().left
  }

  movement.style.setProperty('--y', `${coordinates.top}px`)
  movement.style.setProperty('--x', `${coordinates.left}px`)
}

export default (container: Container = document): void => {
  if (getTouchDevice()) return

  const movements = container.querySelectorAll('*[data-movement]') as NodeListOf<HTMLElement>

  movements.forEach((movement: HTMLElement): void => {
    if (!movement) return

    movement.classList.add('movement')
    movement.addEventListener('mouseover', setMovement as EventListener)
    movement.addEventListener('mousemove', setMovement as EventListener)
  })
}
