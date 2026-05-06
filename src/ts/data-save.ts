import { Container } from '@utils'

interface DataSave {
  [index: string]: string | boolean
}

type FormInput = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

const inputHandler = (input: FormInput): boolean =>
  !input || input.hasAttribute('hidden') || input.type === 'hidden' || input.type === 'file'

export default (container: Container = document): void => {
  const forms = container.querySelectorAll('*[data-save]') as NodeListOf<HTMLFormElement>

  forms.forEach((form: HTMLFormElement): void => {
    if (!form) return

    const value: string = String(form.dataset.save)
    const inputs: FormInput[] = [
      ...form.querySelectorAll('input'),
      ...form.querySelectorAll('select'),
      ...form.querySelectorAll('textarea'),
    ]
    const formData: DataSave = JSON.parse(sessionStorage.getItem(value) || '{}')

    const checkingValue = (): void => {
      inputs.forEach((input: FormInput): void => {
        if (inputHandler(input)) return

        if (input.type === 'checkbox' || input.type === 'radio') {
          formData[input.name] = (input as HTMLInputElement).checked
        } else if (input.value.length !== 0) {
          formData[input.name] = input.value
        }
      })

      sessionStorage.setItem(value, JSON.stringify(formData))
    }

    if (Object.keys(formData).length !== 0) {
      inputs.forEach((input: FormInput): void => {
        if (inputHandler(input)) return

        for (const key in formData) {
          if (input.name === key) {
            if (input.type === 'checkbox' || input.type === 'radio') {
              ;(input as HTMLInputElement).checked = formData[key] as boolean
            } else {
              input.value = formData[key] as string
            }
          }
        }
      })
    }

    checkingValue()
    form.addEventListener('input', checkingValue)
  })
}
