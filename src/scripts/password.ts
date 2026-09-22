import { Container, getData, isEn, logError, source } from '@utils'

const PARSSWORD_VALUE = 'password'
const DATA_PARSSWORD = getData(PARSSWORD_VALUE)
const DATA_LABEL = getData('label')
const DATA_INPUT = getData('input')

const changeTypeInput = (event: Event) => {
  const password: HTMLButtonElement | null = (event.target as HTMLElement).closest(`[${DATA_PARSSWORD}]`)

  if (!password) return

  const label: HTMLLabelElement | HTMLDivElement | null = password.closest(`[${DATA_LABEL}]`)

  if (!label) return

  const input: HTMLInputElement | null = label.querySelector(`*[${DATA_INPUT}="${PARSSWORD_VALUE}"]`)
  const use = password.querySelector('use')

  if (!input || !use) {
    logError(
      isEn
        ? `The ${DATA_LABEL} does not have a ${DATA_INPUT} or use child element`
        : `У ${DATA_LABEL} отсутствует дочерний элемент ${DATA_INPUT} или use`
    )
    return
  }

  const status = input.type === PARSSWORD_VALUE

  input.type = status ? 'text' : PARSSWORD_VALUE
  use.setAttribute('href', status ? `${source}/img/icons.svg#eye-hidden` : `${source}/img/icons.svg#eye-visible`)
}

export default (container: Container = document) => {
  container.addEventListener('click', changeTypeInput)
}
