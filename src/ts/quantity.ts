const quantityDecrease = (decrease: HTMLButtonElement): void => {
  const quantity = decrease.closest('[data-quantity]') as HTMLDivElement
  const input = quantity.querySelector('*[data-input]') as HTMLInputElement
  let value: number = Number(input.value)

  --value
  input.value = String(value)

  if (value < 1) input.value = '1'
}

const quantityIncrease = (increase: HTMLButtonElement): void => {
  const quantity = increase.closest('[data-quantity]') as HTMLDivElement
  const input = quantity.querySelector('*[data-input]') as HTMLInputElement
  let value: number = Number(input.value)

  ++value
  input.value = String(value)
}

export default (): void => {
  document.addEventListener('click', ((event: Event): void => {
    const button = event.target as HTMLButtonElement

    if (button.closest('[data-quantity-decrease]')) quantityDecrease(button)
    if (button.closest('[data-quantity-increase]')) quantityIncrease(button)
  }) as EventListener)
}
