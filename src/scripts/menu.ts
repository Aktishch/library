import { closeSidebar, openSidebar } from '@scripts/sidebar'
import { getData, getTouchDevice } from '@utils'

const DATA_MENU = getData('menu')
const THRESHOLD = 70

export default (container: Document | HTMLElement = document) => {
  if (!getTouchDevice()) return

  const menu: HTMLDivElement | null = container.querySelector(`*[${DATA_MENU}]`)

  if (!menu) return

  let initialY = 0
  let initialX = 0
  let currentY = 0
  let currentX = 0
  let isActive = false

  const onStart = (event: TouchEvent) => {
    const { clientY, clientX } = event.touches[0]

    initialY = clientY
    initialX = clientX
    currentY = clientY
    currentX = clientX
    isActive = !!(event.target as HTMLElement).closest(`[${DATA_MENU}]`)
  }

  const onMove = (event: TouchEvent) => {
    const { clientY, clientX } = event.touches[0]

    currentY = clientY
    currentX = clientX
  }

  const onEnd = () => {
    const deltaY = initialY - currentY
    const deltaX = initialX - currentX

    if (Math.abs(deltaY) > Math.abs(deltaX)) return

    if (isActive) {
      if (deltaX > THRESHOLD) {
        closeSidebar(menu)
      }
    } else {
      if (initialX <= 32 && deltaX < -THRESHOLD) {
        openSidebar(menu)
      }
    }
  }

  container.addEventListener('touchstart', onStart as EventListener, { passive: true })
  container.addEventListener('touchmove', onMove as EventListener, { passive: true })
  container.addEventListener('touchend', onEnd, { passive: true })
  container.addEventListener('touchcancel', onEnd, { passive: true })
}
