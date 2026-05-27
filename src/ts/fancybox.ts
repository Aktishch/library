import { CarouselSlide, Fancybox } from '@fancyapps/ui/dist/fancybox/'
import { initCalendar } from '@ts/air-datepicker'
import imagePreview from '@ts/image-preview'
import lazyLoad from '@ts/lazy-load'
import { setStateSubmitBtn } from '@ts/submit-handler'
import { getData, getTouchDevice } from '@utils'

type Callback = ((container: HTMLElement | undefined) => void) | undefined

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

type Properties = [unknown, unknown, CarouselSlide]

Fancybox.getDefaults().placeFocusBack = false

if (!getTouchDevice()) {
  Fancybox.getDefaults().on = {
    ...Fancybox.getDefaults().on,
    ready: (fancyboxRef): void => {
      const container: HTMLElement | undefined = fancyboxRef.getContainer()

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
            updateLoad()
            callback?.(slide.el)
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
            updateLoad()
            callback?.(slide.el)
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
      'Carousel.contentReady': (): void => {
        updateLoad()
      }
    }
  })

  window.Fancybox.bind(`[${DATA_FANCYBOX}-form]`, {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (...[, , slide]: Properties): void => {
        updateLoad()
        setStateSubmitBtn(slide.el)
      }
    }
  })

  window.Fancybox.bind(`[${DATA_FANCYBOX}-avatar]`, {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (...[, , slide]: Properties): void => {
        updateLoad()
        imagePreview(slide.el)
      }
    }
  })

  window.Fancybox.bind(`[${DATA_FANCYBOX}-calendar]`, {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (...[, , slide]: Properties): void => {
        updateLoad()
        initCalendar(slide.el)
      }
    }
  })
}
