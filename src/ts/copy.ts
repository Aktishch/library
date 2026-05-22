import { logError } from '@utils'

const DATA_COPY: string = 'data-copy'
const HIDDEN_CLASSNAMES: string[] = ['invisible', 'opacity-0']

export default (): void => {
  document.addEventListener('click', (async (event: Event): Promise<void> => {
    const button = (event.target as HTMLElement).closest(`[${DATA_COPY}-button]`) as HTMLButtonElement

    if (!button) return

    const copy = button.closest(`[${DATA_COPY}]`) as HTMLDivElement
    const result = copy.querySelector(`[${DATA_COPY}-result]`) as HTMLSpanElement
    const text: string | undefined = copy.dataset.copy

    if (!text) return

    try {
      await window.navigator.clipboard.writeText(text)
      button.disabled = true
      result.classList.remove(...HIDDEN_CLASSNAMES)
    } catch (error: unknown) {
      logError(error as string)
    } finally {
      setTimeout((): void => {
        button.disabled = false
        result.classList.add(...HIDDEN_CLASSNAMES)
      }, 1000)
    }
  }) as EventListener)
}
