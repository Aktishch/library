import { Fancybox } from '@fancyapps/ui/dist/fancybox/'
import { createCalendar } from '@ts/air-datepicker'
import imagePreview from '@ts/image-preview'
import lazyLoad from '@ts/lazy-load'
import { getStateSubmitBtn } from '@ts/submit-handler'

interface Dialog {
  open: (src: string) => void
  notClosing: (src: string) => void
  close: () => void
}

declare global {
  interface Window {
    Fancybox: typeof Fancybox
    dialog: Dialog
  }
}

Fancybox.getDefaults().placeFocusBack = false
window.Fancybox = Fancybox

const loadUpdate = (): void => lazyLoad().update()

export const dialog: Dialog = {
  open: (src: string): void => {
    window.Fancybox.show(
      [
        {
          src: src,
          type: 'ajax',
        },
      ],
      {
        dragToClose: false,
        on: {
          'Carousel.contentReady': (): void => loadUpdate(),
        },
      }
    )
  },
  notClosing: (src: string): void => {
    window.Fancybox.show(
      [
        {
          src: src,
          type: 'ajax',
        },
      ],
      {
        dragToClose: false,
        closeButton: false,
        backdropClick: false,
        on: {
          'Carousel.contentReady': (): void => loadUpdate(),
        },
      }
    )
  },
  close: (): void => window.Fancybox.close(),
}

window.dialog = dialog

export default (): void => {
  window.Fancybox.bind('[data-fancybox]')

  window.Fancybox.bind('[data-fancybox-dialog]', {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (): void => loadUpdate(),
    },
  })

  window.Fancybox.bind('[data-fancybox-form]', {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (fancyboxRef): void => {
        loadUpdate()
        getStateSubmitBtn(fancyboxRef.getContainer())
      },
    },
  })

  window.Fancybox.bind('[data-fancybox-avatar]', {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (fancyboxRef): void => {
        loadUpdate()
        imagePreview(fancyboxRef.getContainer())
      },
    },
  })

  window.Fancybox.bind('[data-fancybox-calendar]', {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (fancyboxRef): void => {
        loadUpdate()
        createCalendar(fancyboxRef.getContainer())
      },
    },
  })
}
