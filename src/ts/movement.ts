import { Container, Coordinates, getData, getTouchDevice } from '@utils'

const DATA_MOVEMENT: string = getData('movement')

const setMovement = (event: MouseEvent): void => {
  const movement = (event.target as HTMLElement).closest(`[${DATA_MOVEMENT}]`) as HTMLElement
  const coordinates: Coordinates = {
    top: event.clientY - movement.getBoundingClientRect().top,
    left: event.clientX - movement.getBoundingClientRect().left
  }

  movement.style.setProperty('--y', `${coordinates.top}px`)
  movement.style.setProperty('--x', `${coordinates.left}px`)
}

export default (container: Container = document): void => {
  if (getTouchDevice()) return

  const movements = container.querySelectorAll(`*[${DATA_MOVEMENT}]`) as NodeListOf<HTMLElement>

  if (!movements.length) return

  movements.forEach((movement: HTMLElement): void => {
    movement.classList.add('movement')
    movement.addEventListener('mouseover', setMovement as EventListener)
    movement.addEventListener('mousemove', setMovement as EventListener)
  })
}
