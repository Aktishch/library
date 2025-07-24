import { Fancybox } from '@fancyapps/ui'
import { createCalendar } from './air-datepicker'
import filtering from './filtering'
import imagePreview from './image-preview'
import loadMedia from './load-media'
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

Fancybox.defaults.mainClass = 'fancybox-custom'
Fancybox.defaults.trapFocus = false
Fancybox.defaults.autoFocus = false
Fancybox.defaults.placeFocusBack = false
window.Fancybox = Fancybox

const loading = (container: HTMLDivElement): void => {
  const loading = container.querySelector('*[data-loading]') as HTMLDivElement

  if (!loading) return

  setTimeout((): void => loading.remove(), 200)
}

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
          done: (fancybox): void => {
            loading(fancybox.container)
            loadMedia()
          },
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
          done: (fancybox): void => {
            loading(fancybox.container)
            loadMedia()
          },
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
    defaultType: 'ajax',
    on: {
      done: (fancybox): void => {
        loading(fancybox.container)
        loadMedia()
      },
    },
  })

  window.Fancybox.bind('[data-fancybox-form]', {
    dragToClose: false,
    defaultType: 'ajax',
    on: {
      done: (fancybox): void => {
        loading(fancybox.container)
        loadMedia()
        getStateSubmitBtn()
      },
    },
  })

  window.Fancybox.bind('[data-fancybox-avatar]', {
    dragToClose: false,
    defaultType: 'ajax',
    on: {
      done: (fancybox): void => {
        loading(fancybox.container)
        loadMedia()
        imagePreview()
      },
    },
  })

  window.Fancybox.bind('[data-fancybox-calendar]', {
    dragToClose: false,
    defaultType: 'ajax',
    on: {
      done: (fancybox): void => {
        loading(fancybox.container)
        loadMedia()
        createCalendar()
        filtering()
      },
    },
  })
}
