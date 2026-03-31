import { Fancybox } from '@fancyapps/ui/dist/fancybox/'
import { createCalendar } from './air-datepicker'
import imagePreview from './image-preview'
import lazyLoad from './lazy-load'
import { getStateSubmitBtn } from './submit-handler'

type FancyboxDialog = {
  open: (src: string) => void
  notClosing: (src: string) => void
  close: () => void
}

declare global {
  interface Window {
    Fancybox: typeof Fancybox
    dialog: FancyboxDialog
  }
}

Fancybox.getDefaults().placeFocusBack = false
window.Fancybox = Fancybox

const loadUpdate = (): void => lazyLoad().update()

export const dialog: FancyboxDialog = {
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
      'Carousel.contentReady': (): void => {
        loadUpdate()
        getStateSubmitBtn()
      },
    },
  })

  window.Fancybox.bind('[data-fancybox-avatar]', {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (): void => {
        loadUpdate()
        imagePreview()
      },
    },
  })

  window.Fancybox.bind('[data-fancybox-calendar]', {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (): void => {
        loadUpdate()
        createCalendar()
      },
    },
  })
}
