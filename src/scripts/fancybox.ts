import { Fancybox } from '@fancyapps/ui/dist/fancybox/'
import { initCalendar } from '@scripts/air-datepicker'
import imagePreview from '@scripts/image-preview'
import lazyLoad from '@scripts/lazy-load'
import { setStateSubmitBtn } from '@scripts/submit-handler'
import { getData, getTouchDevice, hostname } from '@utils'

type Callback = ((container: HTMLElement | undefined) => void) | undefined

const DATA_FANCYBOX = getData('fancybox')
const DATA_LENIS_PREVENT = getData('lenis-prevent')

const updateLoad = () => {
  lazyLoad().update()
}

export const getDialogSrc = (name: string) => {
  return hostname === 'localhost' ? `/dialogs/${name}.html` : `/dialogs/${name}.php`
}

Fancybox.getDefaults().placeFocusBack = false

if (!getTouchDevice()) {
  Fancybox.getDefaults().on = {
    ...Fancybox.getDefaults().on,
    ready: (fancyboxRef) => {
      const container = fancyboxRef.getContainer()

      if (container) {
        container.setAttribute(DATA_LENIS_PREVENT, '')
      }
    }
  }
}

export const dialog = {
  open: (src: string, callback?: Callback) => {
    Fancybox.show(
      [
        {
          src: src,
          type: 'ajax'
        }
      ],
      {
        dragToClose: false,
        on: {
          'Carousel.contentReady': (...[, , slide]) => {
            const container = slide.el

            if (container) {
              updateLoad()
              callback?.(container)
            }
          }
        }
      }
    )
  },
  notClosing: (src: string, callback?: Callback) => {
    Fancybox.show(
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
          'Carousel.contentReady': (...[, , slide]) => {
            const container = slide.el

            if (container) {
              updateLoad()
              callback?.(container)
            }
          }
        }
      }
    )
  },
  close: () => {
    Fancybox.close()
  }
}

export default () => {
  Fancybox.bind(`[${DATA_FANCYBOX}]`)

  Fancybox.bind(`[${DATA_FANCYBOX}-dialog]`, {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (...[, , slide]) => {
        const container = slide.el

        if (container) {
          updateLoad()
        }
      }
    }
  })

  Fancybox.bind(`[${DATA_FANCYBOX}-form]`, {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (...[, , slide]) => {
        const container = slide.el

        if (container) {
          updateLoad()
          setStateSubmitBtn(container)
        }
      }
    }
  })

  Fancybox.bind(`[${DATA_FANCYBOX}-avatar]`, {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (...[, , slide]) => {
        const container = slide.el

        if (container) {
          updateLoad()
          imagePreview(container)
        }
      }
    }
  })

  Fancybox.bind(`[${DATA_FANCYBOX}-calendar]`, {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (...[, , slide]) => {
        const container = slide.el

        if (container) {
          updateLoad()
          initCalendar(container)
        }
      }
    }
  })
}
