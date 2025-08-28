import { closeSidebar, openSidebar } from './sidebar'
import { touchDevice } from './utils'

export default (): void => {
  const menu = document.getElementById('menu') as HTMLDivElement

  if (!menu || !touchDevice()) return

  const value: number = 100
  let initialX: number
  let currentX: number
  let active: boolean = false

  document.addEventListener('touchstart', ((event: TouchEvent): void => {
    initialX = event.touches[0].clientX
  }) as EventListener)

  document.addEventListener('touchmove', ((event: TouchEvent): void => {
    active = true
    currentX = event.touches[0].clientX
  }) as EventListener)

  document.addEventListener('touchend', ((event: TouchEvent): void => {
    if (!active) return

    if ((event.target as HTMLElement).closest(`#${menu.id}`)) {
      if (initialX - currentX > value) closeSidebar(menu)
    } else {
      if (initialX <= 32 && initialX - currentX < -value) openSidebar(menu)
    }

    active = false
  }) as EventListener)
}
