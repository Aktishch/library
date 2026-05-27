import { Container, getData } from '@utils'

type Quantity = HTMLDivElement | null
type Input = HTMLInputElement | null
type Button = HTMLButtonElement | null

const DATA_QUANTITY: string = getData('quantity')
const DATA_INPUT: string = getData('input')

const decreaseQuantity = (button: HTMLButtonElement): void => {
  const quantity: Quantity = button.closest(`[${DATA_QUANTITY}]`)

  if (!quantity) return

  const input: Input = quantity.querySelector(`*[${DATA_INPUT}]`)

  if (input) {
    let value: number = Number(input.value)

    --value
    input.value = String(value)

    if (value < 1) {
      input.value = '1'
    }
  }
}

const increaseQuantity = (button: HTMLButtonElement): void => {
  const quantity: Quantity = button.closest(`[${DATA_QUANTITY}]`)

  if (!quantity) return

  const input: Input = quantity.querySelector(`*[${DATA_INPUT}]`)

  if (input) {
    let value: number = Number(input.value)

    ++value
    input.value = String(value)
  }
}

export default (container: Container = document): void => {
  container.addEventListener('click', ((event: Event): void => {
    const target: HTMLElement = event.target as HTMLElement
    const decrease: Button = target.closest(`[${DATA_QUANTITY}-decrease]`)
    const increase: Button = target.closest(`[${DATA_QUANTITY}-increase]`)

    if (decrease) {
      decreaseQuantity(decrease)
    }

    if (increase) {
      increaseQuantity(increase)
    }
  }) as EventListener)
}
