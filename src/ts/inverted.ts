import { Container, getData } from '@utils'

const DATA_INVERTED: string = getData('inverted')

export default (container: Container = document): void => {
  container.addEventListener('click', ((event: Event): void => {
    const toggle: HTMLButtonElement | null = (event.target as HTMLElement).closest(`[${DATA_INVERTED}-toggle]`)

    if (!toggle) return

    const value: string | undefined = toggle.dataset.invertedToggle

    if (!value) return

    const inverted: HTMLDivElement | null = toggle.closest(`[${DATA_INVERTED}]`)

    if (inverted) {
      inverted.dataset.inverted = value
    }
  }) as EventListener)
}
