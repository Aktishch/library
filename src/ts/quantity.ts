import { Container, getData, isEn, logError } from '@utils'

type Quantity = HTMLDivElement | null
type Input = HTMLInputElement | null
type Button = HTMLButtonElement | null

const DATA_QUANTITY: string = getData('quantity')

const handleInputError = (): void => {
  logError(
    isEn
      ? `The ${DATA_QUANTITY} does not have a ${DATA_QUANTITY}-input child element`
      : `У ${DATA_QUANTITY} отсутствует дочерний элемент ${DATA_QUANTITY}-input`
  )
}

const changeQuantity = (event: Event): void => {
  const target: HTMLElement = event.target as HTMLElement
  const decrease: Button = target.closest(`[${DATA_QUANTITY}-decrease]`)
  const increase: Button = target.closest(`[${DATA_QUANTITY}-increase]`)

  if (decrease) {
    const quantity: Quantity = decrease.closest(`[${DATA_QUANTITY}]`)

    if (!quantity) return

    const input: Input = quantity.querySelector(`*[${DATA_QUANTITY}-input]`)

    if (!input) {
      handleInputError()
      return
    }

    const minValue: number = Number(input.dataset.quantityInput) || 0
    let value: number = Number(input.value)

    --value
    input.value = String(value)

    if (value < minValue) {
      input.value = String(minValue)
    }
  }

  if (increase) {
    const quantity: Quantity = increase.closest(`[${DATA_QUANTITY}]`)

    if (!quantity) return

    const input: Input = quantity.querySelector(`*[${DATA_QUANTITY}-input]`)

    if (!input) {
      handleInputError()
      return
    }

    let value: number = Number(input.value)

    ++value
    input.value = String(value)
  }
}

export default (container: Container = document): void => {
  container.addEventListener('click', changeQuantity as EventListener)
}
