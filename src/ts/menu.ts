import { closeSidebar, openSidebar } from '@ts/sidebar'
import { getTouchDevice } from '@utils'

export default (): void => {
  if (!getTouchDevice()) return

  const menu = document.querySelector('*[data-menu]') as HTMLDivElement

  if (!menu) return

  const value: number = 100
  let initialX: number
  let currentX: number
  let active: boolean = false

  const onStart = (event: TouchEvent): void => {
    initialX = event.touches[0].clientX
  }

  const onEnd = (event: TouchEvent): void => {
    if (!active) return

    if ((event.target as HTMLElement).closest('[data-menu]')) {
      if (initialX - currentX > value) closeSidebar(menu)
    } else {
      if (initialX <= 32 && initialX - currentX < -value) openSidebar(menu)
    }

    active = false
  }

  const onMove = (event: TouchEvent): void => {
    active = true
    currentX = event.touches[0].clientX
  }

  document.addEventListener('touchstart', onStart as EventListener, { passive: true })
  document.addEventListener('touchend', onEnd as EventListener, { passive: true })
  document.addEventListener('touchcancel', onEnd as EventListener, { passive: true })
  document.addEventListener('touchmove', onMove as EventListener, { passive: true })
}
