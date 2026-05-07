const inputText = (input: HTMLInputElement): void => {
  const regExp: RegExp = /[0-9.,!@№#$%^&*()-=_+`~{}[\]\\/?<>|'"]/

  if (input.value.match(regExp)) input.value = input.value.replace(regExp, '')
}

const inputNumber = (input: HTMLInputElement): void => {
  input.value = input.value.replace(/[^0-9.]/g, '')
}

const inputFloat = (input: HTMLInputElement): void => {
  input.value = input.value.replace(/^\.|[^\d.]|\.(?=.*\.)|^0+(?=\d)/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export default (): void => {
  document.addEventListener('input', ((event: Event): void => {
    const input = event.target as HTMLInputElement

    switch (input.getAttribute('data-input')) {
      case 'text': {
        inputText(input)
        break
      }

      case 'number': {
        inputNumber(input)
        break
      }

      case 'float': {
        inputFloat(input)
        break
      }
    }
  }) as EventListener)
}
