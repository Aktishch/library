const onInputText = (input: HTMLInputElement): void => {
  const regExp: RegExp = /[0-9.,!@№#$%^&*()-=_+`~{}[\]\\/?<>|'"]/

  if (input.value.match(regExp)) input.value = input.value.replace(regExp, '')
}

const onInputNumber = (input: HTMLInputElement): void => {
  input.value = input.value.replace(/[^0-9.]/g, '')
}

const onInputFloat = (input: HTMLInputElement): void => {
  input.value = input.value.replace(/^\.|[^\d.]|\.(?=.*\.)|^0+(?=\d)/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export default (): void => {
  document.addEventListener('input', ((event: Event): void => {
    const input = event.target as HTMLInputElement

    switch (input.getAttribute('data-input')) {
      case 'text': {
        onInputText(input)
        break
      }

      case 'number': {
        onInputNumber(input)
        break
      }

      case 'float': {
        onInputFloat(input)
        break
      }
    }
  }) as EventListener)
}
