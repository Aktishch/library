import { getData, getTouchDevice } from '@utils'

const DATA_MOVEMENT = getData('movement')
const MOVEMENT_CLASSNAME = 'movement'

const setMovement = (event: MouseEvent) => {
  const movement: HTMLElement | null = (event.target as HTMLElement).closest(`[${DATA_MOVEMENT}]`)

  if (!movement) return

  const { clientY, clientX } = event
  const { top, left } = movement.getBoundingClientRect()

  movement.style.setProperty('--y', `${clientY - top}px`)
  movement.style.setProperty('--x', `${clientX - left}px`)
}

export default (container: Document | HTMLElement = document) => {
  if (getTouchDevice()) return

  const movements = container.querySelectorAll<HTMLElement>(`*[${DATA_MOVEMENT}]`)

  if (!movements.length) return

  movements.forEach((movement) => {
    movement.classList.add(MOVEMENT_CLASSNAME)
    movement.addEventListener('mouseover', setMovement as EventListener)
    movement.addEventListener('mousemove', setMovement as EventListener)
  })
}
