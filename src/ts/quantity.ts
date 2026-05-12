const decreaseQuantity = (button: HTMLButtonElement): void => {
  const quantity = button.closest('[data-quantity]') as HTMLDivElement
  const input = quantity.querySelector('*[data-input]') as HTMLInputElement
  let value: number = Number(input.value)

  --value
  input.value = String(value)

  if (value < 1) input.value = '1'
}

const increaseQuantity = (button: HTMLButtonElement): void => {
  const quantity = button.closest('[data-quantity]') as HTMLDivElement
  const input = quantity.querySelector('*[data-input]') as HTMLInputElement
  let value: number = Number(input.value)

  ++value
  input.value = String(value)
}

export default (): void => {
  document.addEventListener('click', ((event: Event): void => {
    const button = event.target as HTMLButtonElement

    if (button.closest('[data-quantity-decrease]')) decreaseQuantity(button)
    if (button.closest('[data-quantity-increase]')) increaseQuantity(button)
  }) as EventListener)
}
