import { CarouselSlide, Fancybox } from '@fancyapps/ui/dist/fancybox/'
import { initCalendar } from '@ts/air-datepicker'
import imagePreview from '@ts/image-preview'
import lazyLoad from '@ts/lazy-load'
import { setStateSubmitBtn } from '@ts/submit-handler'
import { getTouchDevice } from '@utils'

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

if (!getTouchDevice()) {
  Fancybox.getDefaults().on.ready = (fancyboxRef): void => {
    const container = fancyboxRef.getContainer() as HTMLElement

    container.setAttribute('data-lenis-prevent', '')
  }
}

window.Fancybox = Fancybox

const updateLoad = (): void => lazyLoad().update()

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
          'Carousel.contentReady': (): void => updateLoad(),
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
          'Carousel.contentReady': (): void => updateLoad(),
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
      'Carousel.contentReady': (): void => updateLoad(),
    },
  })

  window.Fancybox.bind('[data-fancybox-form]', {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (_, __, slide: CarouselSlide): void => {
        updateLoad()
        setStateSubmitBtn(slide.el)
      },
    },
  })

  window.Fancybox.bind('[data-fancybox-avatar]', {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (_, __, slide: CarouselSlide): void => {
        updateLoad()
        imagePreview(slide.el)
      },
    },
  })

  window.Fancybox.bind('[data-fancybox-calendar]', {
    dragToClose: false,
    on: {
      'Carousel.contentReady': (_, __, slide: CarouselSlide): void => {
        updateLoad()
        initCalendar(slide.el)
      },
    },
  })
}
