import { dialog } from '@ts/fancybox'
import { Container, html } from '@utils'

type Button = HTMLButtonElement | null
type Value = string | undefined

const WARNING_VALUE: string = 'warning'
const POSITIVE_VALUE: string = 'positive'

const checkWarning = (event: Event): void => {
  const button: Button = (event.target as HTMLElement).closest('[data-warning]')

  if (!button) return

  const value: Value = button.dataset.warning

  if (value && value === POSITIVE_VALUE) {
    sessionStorage.setItem(WARNING_VALUE, value)
    dialog.close()
  } else {
    html.innerHTML = ''
  }
}

export default (container: Container = document): void => {
  if (sessionStorage.getItem(WARNING_VALUE) !== POSITIVE_VALUE) {
    setTimeout((): void => {
      dialog.notClosing('/dialogs/dialog-warning.html')
    }, 2000)
  }

  container.addEventListener('click', checkWarning as EventListener)
}
