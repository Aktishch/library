import { Container, isEn, logError, source } from '@utils'

type Password = HTMLButtonElement | null
type Label = HTMLLabelElement | HTMLDivElement | null
type Input = HTMLInputElement | null
type Use = SVGUseElement | null

const handleElementsError = (): void => {
  logError(
    isEn
      ? 'The data-label does not have a data-input or use child element'
      : 'У data-label отсутствует дочерний элемент data-input или use'
  )
}

const changeTypeInput = (event: Event): void => {
  const password: Password = (event.target as HTMLElement).closest('[data-password]')

  if (!password) return

  const label: Label = password.closest('[data-label]')

  if (!label) return

  const input: Input = label.querySelector('*[data-input="password"]')
  const use: Use = password.querySelector('use')

  if (!input || !use) {
    return handleElementsError()
  }

  const status: boolean = input.type === 'password'

  input.type = status ? 'text' : 'password'
  use.setAttribute('href', status ? `${source}/img/icons.svg#eye-hidden` : `${source}/img/icons.svg#eye-visible`)
}

export default (container: Container = document): void => {
  container.addEventListener('click', changeTypeInput as EventListener)
}
