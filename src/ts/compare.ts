import { Container, scrollbarHidden, scrollbarShow } from '@utils'

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

    const setSizeImage = (): void => {
      image.style.width = `${compare.offsetWidth}px`
    }

    const compareStart = (event: Event): void => {
      if ((event.target as HTMLElement).closest('[data-compare-change]')) {
        scrollbarHidden()
        active = true
      }
    }

    const compareEnd = (): void => {
      scrollbarShow()
      active = false
    }

    const compareMove = (event: Event): void => {
      event.stopPropagation()
      event.preventDefault()

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

    setSizeImage()
    window.addEventListener('resize', setSizeImage as EventListener)
    compare.addEventListener('mousedown', compareStart as EventListener)
    compare.addEventListener('mouseup', compareEnd as EventListener)
    compare.addEventListener('mouseleave', compareEnd as EventListener)
    compare.addEventListener('mousemove', compareMove as EventListener)
    compare.addEventListener('touchstart', compareStart as EventListener)
    compare.addEventListener('touchend', compareEnd as EventListener)
    compare.addEventListener('touchcancel', compareEnd as EventListener)
    compare.addEventListener('touchmove', compareMove as EventListener)
  })
}
