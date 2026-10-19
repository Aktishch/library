import { Fancybox } from '@fancyapps/ui/dist/fancybox/'
import { initCalendar } from '@scripts/air-datepicker'
import imagePreview from '@scripts/image-preview'
import lazyLoad from '@scripts/lazy-load'
import { setStateSubmitBtn } from '@scripts/submit-handler'
import { getData, getTouchDevice, hostname } from '@utils'

type Callback = ((container: HTMLElement | undefined) => void) | undefined

Fancybox.getDefaults().placeFocusBack = false

if (!getTouchDevice()) {
  Fancybox.getDefaults().on = {
    ...Fancybox.getDefaults().on,
    ready: (fancyboxRef) => {
      const container = fancyboxRef.getContainer()

      if (container) {
        container.setAttribute('data-lenis-prevent', '')
      }
    }
  }
}

const DATA_FANCYBOX = getData('fancybox')
const CAROUSEL_READY = 'Carousel.contentReady'

const updateLoad = () => {
  lazyLoad().update()
}

export const getDialogSrc = (name: string) => {
  return hostname === 'localhost' ? `/dialogs/${name}.html` : `/dialogs/${name}.php`
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
          [CAROUSEL_READY]: (...[, , slide]) => {
            const { el } = slide

            if (el) {
              updateLoad()
              callback?.(el)
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
          [CAROUSEL_READY]: (...[, , slide]) => {
            const { el } = slide

            if (el) {
              updateLoad()
              callback?.(el)
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
      [CAROUSEL_READY]: (...[, , slide]) => {
        const { el } = slide

        if (el) {
          updateLoad()
        }
      }
    }
  })

  Fancybox.bind(`[${DATA_FANCYBOX}-form]`, {
    dragToClose: false,
    on: {
      [CAROUSEL_READY]: (...[, , slide]) => {
        const { el } = slide

        if (el) {
          updateLoad()
          setStateSubmitBtn(el)
        }
      }
    }
  })

  Fancybox.bind(`[${DATA_FANCYBOX}-avatar]`, {
    dragToClose: false,
    on: {
      [CAROUSEL_READY]: (...[, , slide]) => {
        const { el } = slide

        if (el) {
          updateLoad()
          imagePreview(el)
        }
      }
    }
  })

  Fancybox.bind(`[${DATA_FANCYBOX}-calendar]`, {
    dragToClose: false,
    on: {
      [CAROUSEL_READY]: (...[, , slide]) => {
        const { el } = slide

        if (el) {
          updateLoad()
          initCalendar(el)
        }
      }
    }
  })
}
