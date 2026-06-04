import { Container, getData, isEn, logError } from '@utils'

type Value = string | undefined
type Input = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

const DATA_SAVE: string = getData('save')

const handleInput = (input: Input): boolean => {
  return !input || input.hasAttribute('hidden') || input.type === 'hidden' || input.type === 'file'
}

export default (container: Container = document): void => {
  const forms: NodeListOf<HTMLFormElement> = container.querySelectorAll(`*[${DATA_SAVE}]`)

  if (!forms.length) return

  forms.forEach((form: HTMLFormElement): void => {
    const value: Value = form.dataset.save

    if (!value) {
      return logError(isEn ? `${DATA_SAVE} is missing a value` : `У ${DATA_SAVE} отсутствует значение`)
    }

    const dataSave: Record<string, string | boolean> = JSON.parse(sessionStorage.getItem(value) || '{}')
    const inputs: Input[] = [
      ...form.querySelectorAll('input'),
      ...form.querySelectorAll('select'),
      ...form.querySelectorAll('textarea')
    ]

    const enterData = (): void => {
      inputs.forEach((input: Input): void => {
        if (handleInput(input)) return

        if (input.type === 'checkbox' || input.type === 'radio') {
          dataSave[input.name] = (input as HTMLInputElement).checked
        } else if (input.value.length) {
          dataSave[input.name] = input.value
        }
      })

      sessionStorage.setItem(value, JSON.stringify(dataSave))
    }

    if (Object.keys(dataSave).length) {
      inputs.forEach((input: Input): void => {
        if (handleInput(input)) return

        for (const key in dataSave) {
          if (input.name === key) {
            if (input.type === 'checkbox' || input.type === 'radio') {
              ;(input as HTMLInputElement).checked = dataSave[key] as boolean
            } else {
              input.value = dataSave[key] as string
            }
          }
        }
      })
    }

    enterData()
    form.addEventListener('input', enterData)
  })
}
