import { Container } from '@utils'

type Selection = number | null

const getPhoneValue = (input: HTMLInputElement): string => {
  return input.value.replace(/\D/g, '')
}

const getFormatValue = (value: string): string => {
  if (!['7', '8'].includes(value[0])) {
    value = '7' + value
  }

  const firstValue: string = value[0] === '8' ? '8' : '+7'
  let formatted: string

  formatted = firstValue + ' '

  if (value.length > 1) {
    formatted += '(' + value.substring(1, 4)
  }

  if (value.length >= 5) {
    formatted += ') ' + value.substring(4, 7)
  }

  if (value.length >= 8) {
    formatted += '-' + value.substring(7, 9)
  }

  if (value.length >= 10) {
    formatted += '-' + value.substring(9, 11)
  }

  return formatted
}

const onInput = (event: InputEvent): '' | undefined => {
  const input: HTMLInputElement = event.target as HTMLInputElement

  if (input.getAttribute('type') !== 'tel') return

  const selection: Selection = input.selectionStart
  const value: string = getPhoneValue(input)

  if (!value) {
    return (input.value = '')
  }

  if (input.value.length !== selection) {
    if (event.data) {
      input.value = getFormatValue(value)
    }

    return
  }

  input.value = getFormatValue(value)
}

const onKeyUp = (event: KeyboardEvent): void => {
  const input: HTMLInputElement = event.target as HTMLInputElement

  if (input.getAttribute('type') !== 'tel') return

  input.maxLength = input.value[0] === '8' ? 17 : 18
}

const onKeyDown = (event: KeyboardEvent): void => {
  const input: HTMLInputElement = event.target as HTMLInputElement

  if (input.getAttribute('type') !== 'tel') return

  const value: string = getPhoneValue(input)

  if (event.code === 'Backspace' && value.length === 1) {
    input.value = ''
  }
}

export default (container: Container = document): void => {
  container.addEventListener('input', onInput as EventListener)
  container.addEventListener('keyup', onKeyUp as EventListener)
  container.addEventListener('keydown', onKeyDown as EventListener)
}
