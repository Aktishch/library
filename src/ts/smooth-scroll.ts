import { setAnimation } from './animation'
import { isSafari, scrolledPage, touchDevice } from './utils'

export default (): void => {
  const smoothScroll = document.querySelector('#smooth-scroll') as HTMLDivElement

  if (!smoothScroll || isSafari() || touchDevice()) return

  const html = document.documentElement as HTMLHtmlElement
  const body = document.body as HTMLBodyElement
  const wrappers = smoothScroll.querySelectorAll('*[data-smooth-wrapper]') as NodeListOf<HTMLElement>
  const speed: number = Number(smoothScroll.dataset.smoothSpeed) / 100 || 0.02
  let smoothSpeed: number = speed
  let offset: number = 0

  const setBodyHeight = (): void => {
    const height: number = smoothScroll.getBoundingClientRect().height - 1

    body.style.height = `${Math.floor(height)}px`
  }

  const createSmoothScroll = (): void => {
    setBodyHeight()
    offset += (scrolledPage().top - offset) * smoothSpeed

    const translateY: string = `translateY(-${offset}px)`

    smoothScroll.style.transform = translateY
    sessionStorage.setItem('translateY', translateY)
    setAnimation()
    window.requestAnimationFrame(createSmoothScroll)
  }

  if (performance.navigation.type === 1 && sessionStorage.getItem('translateY')) {
    setBodyHeight()
    smoothSpeed = 1
    smoothScroll.style.transform = String(sessionStorage.getItem('translateY'))
    setTimeout((): void => {
      smoothSpeed = speed
    }, 500)
  }

  html.classList.add('overflow-x-hidden')
  body.classList.add('overflow-hidden')
  smoothScroll.classList.add('fixed', 'top-0', 'left-0', 'right-0', 'overflow-hidden', 'will-change-transform')
  window.requestAnimationFrame(createSmoothScroll)

  wrappers.forEach((wrapper: HTMLElement): void => {
    if (!wrapper) return

    const stickys = wrapper.querySelectorAll('*[data-smooth-sticky]') as NodeListOf<HTMLElement>
    const layers = wrapper.querySelectorAll('*[data-smooth-layer]') as NodeListOf<HTMLElement>

    stickys.forEach((sticky: HTMLElement): void => {
      if (!sticky) return

      let stickyPosition: number = 0

      sticky.classList.add('will-change-transform')

      const createSmothSticky = (): void => {
        if (
          wrapper.getBoundingClientRect().top < 0 &&
          wrapper.getBoundingClientRect().bottom - sticky.offsetHeight > 0
        ) {
          stickyPosition += (scrolledPage().top - wrapper.offsetTop - stickyPosition) * speed
          sticky.style.transform = `translateY(${stickyPosition}px)`
        }

        window.requestAnimationFrame(createSmothSticky)
      }

      window.requestAnimationFrame(createSmothSticky)
    })

    layers.forEach((layer: HTMLElement): void => {
      if (!layer) return

      const layerSpeed: number = Number(layer.dataset.smoothSpeed) / 100 || 0.02
      const layerDepth: number = Number(layer.dataset.smoothDepth) || 1
      let layerPosition: number = 0

      layer.classList.add('will-change-transform')

      const createSmoothLayer = (): void => {
        if (
          wrapper.getBoundingClientRect().top - window.screen.height <= 0 &&
          scrolledPage().top < wrapper.offsetTop + wrapper.offsetHeight
        ) {
          layerPosition += (scrolledPage().top - wrapper.offsetTop - layerPosition) * layerSpeed

          switch (layer.dataset.smoothLayer) {
            case 'top': {
              layer.style.transform = `translateY(${-layerPosition / layerDepth}px)`
              break
            }

            case 'bottom': {
              layer.style.transform = `translateY(${layerPosition / layerDepth}px)`
              break
            }

            case 'left': {
              layer.style.transform = `translateX(${-layerPosition / layerDepth}px)`
              break
            }

            case 'right': {
              layer.style.transform = `translateX(${layerPosition / layerDepth}px)`
              break
            }

            default:
              return
          }
        }

        window.requestAnimationFrame(createSmoothLayer)
      }

      window.requestAnimationFrame(createSmoothLayer)
    })
  })
}
