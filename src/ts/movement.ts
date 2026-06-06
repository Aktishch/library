import { Container, Coordinates, getData, getTouchDevice } from '@utils'

type Movement = HTMLElement | null

const DATA_MOVEMENT: string = getData('movement')

const setMovement = (event: MouseEvent): void => {
  const movement: Movement = (event.target as HTMLElement).closest(`[${DATA_MOVEMENT}]`)

  if (!movement) return

  const coordinates: Coordinates = {
    top: event.clientY - movement.getBoundingClientRect().top,
    left: event.clientX - movement.getBoundingClientRect().left
  }

  movement.style.setProperty('--y', `${coordinates.top}px`)
  movement.style.setProperty('--x', `${coordinates.left}px`)
}

export default (container: Container = document): void => {
  if (getTouchDevice()) return

  const movements: NodeListOf<HTMLElement> = container.querySelectorAll(`*[${DATA_MOVEMENT}]`)

  if (!movements.length) return

  movements.forEach((movement: HTMLElement): void => {
    movement.classList.add('movement')
    movement.addEventListener('mouseover', setMovement as EventListener)
    movement.addEventListener('mousemove', setMovement as EventListener)
  })
}
