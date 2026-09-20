import { Container, getData, isEn, logError } from '@utils'

const DATA_INVERTED = getData('inverted')

const setInverted = (event: Event) => {
  const toggle: HTMLButtonElement | null = (event.target as HTMLElement).closest(`[${DATA_INVERTED}-toggle]`)

  if (!toggle) return

  const value = toggle.dataset.invertedToggle

  if (!value) {
    logError(isEn ? `${DATA_INVERTED}-toggle is missing a value` : `У ${DATA_INVERTED}-toggle отсутствует значение`)
    return
  }

  const inverted: HTMLDivElement | null = toggle.closest(`[${DATA_INVERTED}]`)

  if (inverted) {
    inverted.dataset.inverted = value
  }
}

export default (container: Container = document) => {
  container.addEventListener('click', setInverted)
}
