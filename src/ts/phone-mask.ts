const getPhoneValue = (input: HTMLInputElement): string => {
  return input.value.replace(/\D/g, '')
}

const formatterValue = (value: string): string => {
  if (value[0] === '9') value = '7' + value

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
    if (event.data) input.value = formatterValue(value)
    return
  }

  input.value = formatterValue(value)
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

const onPaste = (event: ClipboardEvent): void => {
  const input = event.target as HTMLInputElement
  const value: string = getPhoneValue(input)
  const pasted: DataTransfer | null = event.clipboardData

  if (pasted && /\D/g.test(pasted.getData('Text'))) {
    input.value = value
    return
  }
}

export default (): void => {
  const phoneEvents: string[] = ['input', 'keyup', 'keydown', 'paste']

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

          case 'paste': {
            onPaste(event as ClipboardEvent)
            break
          }
        }
      }
    }) as EventListener)
  })
}
