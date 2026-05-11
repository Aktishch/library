const phoneEvents: string[] = ['input', 'keyup', 'keydown']

const getPhoneValue = (input: HTMLInputElement): string => input.value.replace(/\D/g, '')

const getFormatValue = (value: string): string => {
  if (!['7', '8'].includes(value[0])) value = '7' + value

  const firstVal: string = value[0] === '8' ? '8' : '+7'
  let formatted: string

  formatted = firstVal + ' '

  if (value.length > 1) formatted += '(' + value.substring(1, 4)
  if (value.length >= 5) formatted += ') ' + value.substring(4, 7)
  if (value.length >= 8) formatted += '-' + value.substring(7, 9)
  if (value.length >= 10) formatted += '-' + value.substring(9, 11)

  return formatted
}

const onInput = (event: InputEvent): '' | undefined => {
  const input = event.target as HTMLInputElement
  const selection: number | null = input.selectionStart
  const value: string = getPhoneValue(input)

  if (!value) return (input.value = '')

  if (input.value.length !== selection) {
    if (event.data) input.value = getFormatValue(value)
    return
  }

  input.value = getFormatValue(value)
}

const onKeyUp = (event: KeyboardEvent): void => {
  const input = event.target as HTMLInputElement

  input.maxLength = input.value[0] === '8' ? 17 : 18
}

const onKeyDown = (event: KeyboardEvent): void => {
  const input = event.target as HTMLInputElement
  const value: string = getPhoneValue(input)

  if (event.code === 'Backspace' && value.length === 1) input.value = ''
}

export default (): void => {
  phoneEvents.forEach((phoneEvent: string): void => {
    document.addEventListener(phoneEvent, ((event: Event): void => {
      if ((event.target as HTMLInputElement).getAttribute('type') === 'tel') {
        switch (event.type) {
          case 'input': {
            onInput(event as InputEvent)
            break
          }

          case 'keyup': {
            onKeyUp(event as KeyboardEvent)
            break
          }

          case 'keydown': {
            onKeyDown(event as KeyboardEvent)
            break
          }
        }
      }
    }) as EventListener)
  })
}
