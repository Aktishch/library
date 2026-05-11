import { Container } from '@utils'

interface DataSave {
  [index: string]: string | boolean
}

type Input = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

const handleInput = (input: Input): boolean =>
  !input || input.hasAttribute('hidden') || input.type === 'hidden' || input.type === 'file'

export default (container: Container = document): void => {
  const forms = container.querySelectorAll('*[data-save]') as NodeListOf<HTMLFormElement>

  forms.forEach((form: HTMLFormElement): void => {
    if (!form || !form.dataset.save) return

    const value: string = form.dataset.save
    const inputs: Input[] = [
      ...form.querySelectorAll('input'),
      ...form.querySelectorAll('select'),
      ...form.querySelectorAll('textarea'),
    ]
    const dataSave: DataSave = JSON.parse(sessionStorage.getItem(value) || '{}')

    const enterData = (): void => {
      inputs.forEach((input: Input): void => {
        if (handleInput(input)) return

        if (input.type === 'checkbox' || input.type === 'radio') {
          dataSave[input.name] = (input as HTMLInputElement).checked
        } else if (input.value.length !== 0) {
          dataSave[input.name] = input.value
        }
      })

      sessionStorage.setItem(value, JSON.stringify(dataSave))
    }

    if (Object.keys(dataSave).length !== 0) {
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
