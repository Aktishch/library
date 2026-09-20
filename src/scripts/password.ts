import { Container, isEn, logError, source } from '@utils'

const changeTypeInput = (event: Event) => {
  const password: HTMLButtonElement | null = (event.target as HTMLElement).closest('[data-password]')

  if (!password) return

  const label: HTMLLabelElement | HTMLDivElement | null = password.closest('[data-label]')

  if (!label) return

  const input: HTMLInputElement | null = label.querySelector('*[data-input="password"]')
  const use: SVGUseElement | null = password.querySelector('use')

  if (!input || !use) {
    logError(
      isEn
        ? 'The data-label does not have a data-input or use child element'
        : 'У data-label отсутствует дочерний элемент data-input или use'
    )
    return
  }

  const status = input.type === 'password'

  input.type = status ? 'text' : 'password'
  use.setAttribute('href', status ? `${source}/img/icons.svg#eye-hidden` : `${source}/img/icons.svg#eye-visible`)
}

export default (container: Container = document) => {
  container.addEventListener('click', changeTypeInput)
}
