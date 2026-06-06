import { closeSidebar, openSidebar } from '@ts/sidebar'
import { Container, getData, getTouchDevice } from '@utils'

type Menu = HTMLDivElement | null

const DATA_MENU: string = getData('menu')

export default (container: Container = document): void => {
  if (!getTouchDevice()) return

  const menu: Menu = container.querySelector(`*[${DATA_MENU}]`)

  if (!menu) return

  const threshold: number = 70
  let initialY: number = 0
  let initialX: number = 0
  let currentY: number = 0
  let currentX: number = 0
  let isActive: boolean = false

  const onStart = (event: TouchEvent): void => {
    const touch: Touch = event.touches[0]

    initialY = touch.clientY
    initialX = touch.clientX
    currentY = touch.clientY
    currentX = touch.clientX
    isActive = !!(event.target as HTMLElement).closest(`[${DATA_MENU}]`)
  }

  const onMove = (event: TouchEvent): void => {
    const touch: Touch = event.touches[0]

    currentY = touch.clientY
    currentX = touch.clientX
  }

  const onEnd = (): void => {
    const deltaY: number = initialY - currentY
    const deltaX: number = initialX - currentX

    if (Math.abs(deltaY) > Math.abs(deltaX)) return

    if (isActive) {
      if (deltaX > threshold) {
        closeSidebar(menu)
      }
    } else {
      if (initialX <= 32 && deltaX < -threshold) {
        openSidebar(menu)
      }
    }
  }

  container.addEventListener('touchstart', onStart as EventListener, { passive: true })
  container.addEventListener('touchmove', onMove as EventListener, { passive: true })
  container.addEventListener('touchend', onEnd as EventListener, { passive: true })
  container.addEventListener('touchcancel', onEnd as EventListener, { passive: true })
}
