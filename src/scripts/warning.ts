import { dialog, getDialogSrc } from '@scripts/fancybox'
import { getData, html } from '@utils'

const WARNING_VALUE = 'warning'
const DATA_WARNING = getData(WARNING_VALUE)
const POSITIVE_VALUE = 'positive'

const checkWarning = (event: Event) => {
  const button: HTMLButtonElement | null = (event.target as HTMLElement).closest(`[${DATA_WARNING}]`)

  if (!button) return

  const value = button.dataset.warning

  if (value && value === POSITIVE_VALUE) {
    sessionStorage.setItem(WARNING_VALUE, value)
    dialog.close()
  } else {
    html.innerHTML = ''
  }
}

export default (container: Document | HTMLElement = document) => {
  if (sessionStorage.getItem(WARNING_VALUE) !== POSITIVE_VALUE) {
    setTimeout(() => {
      dialog.notClosing(getDialogSrc(WARNING_VALUE))
    }, 2000)

    container.addEventListener('click', checkWarning)
  }
}
