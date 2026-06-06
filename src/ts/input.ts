import { Container } from '@utils'

type Selection = number | null

const onInput = (event: Event): void => {
  const input: HTMLInputElement = event.target as HTMLInputElement

  switch (input.getAttribute('data-input')) {
    case 'text': {
      const regExp: RegExp = /[0-9.,!@№#$%^&*()\-=_+`~{}[\]\\/?<>|'"]/g

      if (input.value.match(regExp)) {
        input.value = input.value.replace(regExp, '')
      }

      break
    }

    case 'number': {
      input.value = input.value.replace(/[^0-9.]/g, '')
      break
    }

    case 'float': {
      const selection: Selection = input.selectionStart
      const length: number = input.value.length
      const value: string = input.value
        .replace(/^\.|[^\d.]|\.(?=.*\.)|^0+(?=\d)/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

      input.value = value

      if (selection) {
        const newLength: number = value.length
        const cursorPosition: number = selection + (newLength - length)

        input.setSelectionRange(cursorPosition, cursorPosition)
      }

      break
    }
  }
}

export default (container: Container = document): void => {
  container.addEventListener('input', onInput as EventListener)
}
