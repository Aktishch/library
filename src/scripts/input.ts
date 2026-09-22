import { Container, getData } from '@utils'

const DATA_INPUT = getData('input')

const onInput = (event: Event) => {
  const input = event.target as HTMLInputElement

  switch (input.getAttribute(DATA_INPUT)) {
    case 'text': {
      const regExp = /[0-9.,!@№#$%^&*()\-=_+`~{}[\]\\/?<>|'"]/g

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
      const selection = input.selectionStart
      const length = input.value.length
      const value = input.value.replace(/^\.|[^\d.]|\.(?=.*\.)|^0+(?=\d)/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

      input.value = value

      if (selection) {
        const newLength = value.length
        const cursorPosition = selection + (newLength - length)

        input.setSelectionRange(cursorPosition, cursorPosition)
      }

      break
    }
  }
}

export default (container: Container = document) => {
  container.addEventListener('input', onInput)
}
