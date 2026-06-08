import { Container, getData, isEn, logError } from '@utils'

type Inverted = HTMLDivElement | null
type Toggle = HTMLButtonElement | null
type Value = string | undefined

const DATA_INVERTED: string = getData('inverted')

const handleValueError = (): void => {
  logError(isEn ? `${DATA_INVERTED}-toggle is missing a value` : `У ${DATA_INVERTED}-toggle отсутствует значение`)
}

const setInverted = (event: Event): void => {
  const toggle: Toggle = (event.target as HTMLElement).closest(`[${DATA_INVERTED}-toggle]`)

  if (!toggle) return

  const value: Value = toggle.dataset.invertedToggle

  if (!value) {
    handleValueError()
    return
  }

  const inverted: Inverted = toggle.closest(`[${DATA_INVERTED}]`)

  if (inverted) {
    inverted.dataset.inverted = value
  }
}

export default (container: Container = document): void => {
  container.addEventListener('click', setInverted as EventListener)
}
