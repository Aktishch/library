import { CarouselSlide, Fancybox } from '@fancyapps/ui/dist/fancybox/'
import { initCalendar } from '@ts/air-datepicker'
import imagePreview from '@ts/image-preview'
import lazyLoad from '@ts/lazy-load'
import { setStateSubmitBtn } from '@ts/submit-handler'
import { getData, getTouchDevice } from '@utils'

type Container = HTMLElement | undefined
type Callback = ((container: Container) => void) | undefined
type Properties = [unknown, unknown, CarouselSlide]

interface Dialog {
  open: (src: string, callback?: Callback) => void
  notClosing: (src: string, callback?: Callback) => void
  close: () => void
}

declare global {
  interface Window {
    Fancybox: typeof Fancybox
    dialog: Dialog
  }
}

Fancybox.getDefaults().placeFocusBack = false

if (!getTouchDevice()) {
  Fancybox.getDefaults().on = {
    ...Fancybox.getDefaults().on,
    ready: (fancyboxRef): void => {
      const container: Container = fancyboxRef.getContainer()

      if (container) {
        container.setAttribute('data-lenis-prevent', '')
      }
    }
  }
}

window.Fancybox = Fancybox

const DATA_FANCYBOX: string = getData('fancybox')

const updateLoad = (): void => {
  lazyLoad().update()
}

export const dialog: Dialog = {
  open: (src: string, callback: Callback): void => {
    window.Fancybox.show(
      [
        {
          src: src,
          type: 'ajax'
        }
      ],
      {
        dragToClose: false,
        on: {
          'Carousel.contentReady': (...[, , slide]: Properties): void => {
            const container: Container = slide.el

            if (container) {
              updateLoad()
              callback?.(container)
            }
          }
        }
      }
    )
  },
  notClosing: (src: string, callback: Callback): void => {
    window.Fancybox.show(
      [
        {
          src: src,
          type: 'ajax'
        }
      ],
      {
        dragToClose: false,
        closeButton: false,
        backdropClick: false,
        on: {
          'Carousel.contentReady': (...[, , slide]: Properties): void => {
            const container: Container = slide.el

            if (container) {
              updateLoad()
              callback?.(container)
            }
          }
        }
      }
    )
  },
  close: (): void => {
    window.Fancybox.close()
  }
}

window.dialog = dialog

export default (): void => {
  window.Fancybox.bind(`[${DATA_FANCYBOX}]`)

  window.Fancybox.bind(`[${DATA_FANCYBOX}-dialog]`, {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (...[, , slide]: Properties): void => {
        const container: Container = slide.el

        if (container) {
          updateLoad()
        }
      }
    }
  })

  window.Fancybox.bind(`[${DATA_FANCYBOX}-form]`, {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (...[, , slide]: Properties): void => {
        const container: Container = slide.el

        if (container) {
          updateLoad()
          setStateSubmitBtn(container)
        }
      }
    }
  })

  window.Fancybox.bind(`[${DATA_FANCYBOX}-avatar]`, {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (...[, , slide]: Properties): void => {
        const container: Container = slide.el

        if (container) {
          updateLoad()
          imagePreview(container)
        }
      }
    }
  })

  window.Fancybox.bind(`[${DATA_FANCYBOX}-calendar]`, {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (...[, , slide]: Properties): void => {
        const container: Container = slide.el

        if (container) {
          updateLoad()
          initCalendar(container)
        }
      }
    }
  })
}
