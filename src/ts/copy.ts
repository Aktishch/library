import { Container, getData, isEn, logError } from '@utils'

type Copy = HTMLDivElement | null
type Button = HTMLButtonElement | null
type Result = HTMLSpanElement | null | undefined
type Text = string | undefined

const DATA_COPY: string = getData('copy')
const HIDDEN_CLASSNAMES: string[] = ['invisible', 'opacity-0']

const setCopy = async (event: Event): Promise<void> => {
  const button: Button = (event.target as HTMLElement).closest(`[${DATA_COPY}-button]`)

  if (!button) return

  const copy: Copy = button.closest(`[${DATA_COPY}]`)
  const result: Result = copy?.querySelector(`[${DATA_COPY}-result]`)
  const text: Text = copy?.dataset.copy

  if (!text) return

  const clipboard: Clipboard = window.navigator.clipboard

  try {
    if (!clipboard) {
      throw isEn
        ? 'Clipboard API not supported or secure context (HTTPS) is missing'
        : 'API буфера обмена не поддерживается или отсутствует защищенный контекст (HTTPS)'
    }

    await clipboard.writeText(text)
    button.disabled = true
    result?.classList.remove(...HIDDEN_CLASSNAMES)
  } catch (error: unknown) {
    logError(error as string)
  } finally {
    setTimeout((): void => {
      button.disabled = false
      result?.classList.add(...HIDDEN_CLASSNAMES)
    }, 1000)
  }
}

export default (container: Container = document): void => {
  container.addEventListener('click', setCopy as EventListener)
}
