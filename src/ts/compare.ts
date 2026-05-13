import { Container, hideScrollbar, showScrollbar } from '@utils'

export default (container: Container = document): void => {
  const compares = container.querySelectorAll('*[data-compare]') as NodeListOf<HTMLDivElement>

  compares.forEach((compare: HTMLDivElement): void => {
    if (!compare) return

    const before = compare.querySelector('*[data-compare-before]') as HTMLDivElement
    const image = compare.querySelector('*[data-compare-image]') as HTMLImageElement
    const change = compare.querySelector('*[data-compare-change]') as HTMLDivElement
    let active: boolean = false
    let value: number
    let position: number

    const setWidthImage = (): void => {
      image.style.width = `${compare.offsetWidth}px`
    }

    const onStart = (event: Event): void => {
      if ((event.target as HTMLElement).closest('[data-compare-change]')) {
        hideScrollbar()
        active = true
      }
    }

    const onEnd = (): void => {
      showScrollbar()
      active = false
    }

    const onMove = (event: Event): void => {
      event.stopPropagation()

      if (!active) return

      switch (event.type) {
        case 'mousemove': {
          position = (event as MouseEvent).pageX
          break
        }

        case 'touchmove': {
          for (let i: number = 0; i < (event as TouchEvent).changedTouches.length; i++) {
            position = (event as TouchEvent).changedTouches[i].pageX
          }

          break
        }
      }

      position -= compare.getBoundingClientRect().left
      value = Math.max(0, Math.min(position, compare.offsetWidth))
      before.style.width = `${value}px`
      change.style.left = `${value}px`
    }

    setWidthImage()
    window.addEventListener('resize', setWidthImage as EventListener)
    compare.addEventListener('mousedown', onStart as EventListener)
    compare.addEventListener('mouseup', onEnd as EventListener)
    compare.addEventListener('mouseleave', onEnd as EventListener)
    compare.addEventListener('mousemove', onMove as EventListener)
    compare.addEventListener('touchstart', onStart as EventListener, { passive: true })
    compare.addEventListener('touchend', onEnd as EventListener, { passive: true })
    compare.addEventListener('touchcancel', onEnd as EventListener, { passive: true })
    compare.addEventListener('touchmove', onMove as EventListener, { passive: true })
  })
}
