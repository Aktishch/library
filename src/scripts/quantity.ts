import { getData, isEn, logError } from '@utils'

const DATA_QUANTITY = getData('quantity')

const handleInputError = () => {
  logError(
    isEn
      ? `The ${DATA_QUANTITY} does not have a ${DATA_QUANTITY}-input child element`
      : `У ${DATA_QUANTITY} отсутствует дочерний элемент ${DATA_QUANTITY}-input`
  )
}

const changeQuantity = (event: Event) => {
  const target = event.target as HTMLElement
  const decrease: HTMLButtonElement | null = target.closest(`[${DATA_QUANTITY}-decrease]`)
  const increase: HTMLButtonElement | null = target.closest(`[${DATA_QUANTITY}-increase]`)

  if (decrease) {
    const quantity: HTMLDivElement | null = decrease.closest(`[${DATA_QUANTITY}]`)

    if (!quantity) return

    const input: HTMLInputElement | null = quantity.querySelector(`*[${DATA_QUANTITY}-input]`)

    if (!input) {
      handleInputError()
      return
    }

    const minValue = Number(input.dataset.quantityInput) || 0
    let value = Number(input.value)

    --value
    input.value = String(value)

    if (value < minValue) {
      input.value = String(minValue)
    }
  }

  if (increase) {
    const quantity: HTMLDivElement | null = increase.closest(`[${DATA_QUANTITY}]`)

    if (!quantity) return

    const input: HTMLInputElement | null = quantity.querySelector(`*[${DATA_QUANTITY}-input]`)

    if (!input) {
      handleInputError()
      return
    }

    let value = Number(input.value)

    ++value
    input.value = String(value)
  }
}

export default (container: Document | HTMLElement = document) => {
  container.addEventListener('click', changeQuantity)
}
