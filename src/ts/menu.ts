import { closeSidebar, openSidebar } from '@ts/sidebar'
import { touchDevice } from '@utils'

export default (): void => {
  if (!touchDevice()) return

  const menu = document.getElementById('menu') as HTMLDivElement

  if (!menu) return

  const value: number = 100
  let initialX: number
  let currentX: number
  let active: boolean = false

  const touchStart = (event: TouchEvent): void => {
    initialX = event.touches[0].clientX
  }

  const touchEnd = (event: TouchEvent): void => {
    if (!active) return

    if ((event.target as HTMLElement).closest(`#${menu.id}`)) {
      if (initialX - currentX > value) closeSidebar(menu)
    } else {
      if (initialX <= 32 && initialX - currentX < -value) openSidebar(menu)
    }

    active = false
  }

  const touchMove = (event: TouchEvent): void => {
    event.stopPropagation()
    active = true
    currentX = event.touches[0].clientX
  }

  document.addEventListener('touchstart', touchStart as EventListener, { passive: true })
  document.addEventListener('touchend', touchEnd as EventListener, { passive: true })
  document.addEventListener('touchcancel', touchEnd as EventListener, { passive: true })
  document.addEventListener('touchmove', touchMove as EventListener, { passive: true })
}
