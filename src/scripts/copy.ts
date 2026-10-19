import { getData, isRu, logError } from '@utils'

const DATA_COPY = getData('copy')
const VISIBLE_CLASSNAMES = ['invisible', 'opacity-0']

const setCopy = async (event: Event) => {
  const button: HTMLButtonElement | null = (event.target as HTMLElement).closest(`[${DATA_COPY}-button]`)

  if (!button) return

  const copy: HTMLDivElement | null = button.closest(`[${DATA_COPY}]`)

  if (!copy) return

  const result: HTMLSpanElement | null = copy.querySelector(`[${DATA_COPY}-result]`)
  const text = copy.dataset.copy

  if (!text) return

  const clipboard = window.navigator.clipboard

  try {
    if (!clipboard) {
      throw isRu
        ? 'API буфера обмена не поддерживается или отсутствует защищенный контекст (HTTPS)'
        : 'Clipboard API not supported or secure context (HTTPS) is missing'
    }

    await clipboard.writeText(text)
    button.disabled = true
    result?.classList.remove(...VISIBLE_CLASSNAMES)
  } catch (error) {
    logError(error as string)
  } finally {
    setTimeout(() => {
      button.disabled = false
      result?.classList.add(...VISIBLE_CLASSNAMES)
    }, 1000)
  }
}

export default (container: Document | HTMLElement = document) => {
  container.addEventListener('click', setCopy)
}
