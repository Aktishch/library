interface DataSave {
  [index: string]: string
}

const checkingValue = (input: HTMLInputElement): boolean =>
  input.dataset.input !== 'file' && input.dataset.input !== 'switch'

const saveFormData = (id: string): void => {
  const form = document.getElementById(id) as HTMLFormElement

  if (!form) return

  const inputs = form.querySelectorAll('*[data-input]') as NodeListOf<HTMLInputElement>
  let formData: DataSave = {}

  if (sessionStorage.getItem(id)) {
    formData = JSON.parse(sessionStorage.getItem(id) || '{}')

    inputs.forEach((input: HTMLInputElement): void => {
      if (checkingValue(input)) {
        for (const key in formData) if (input.name === key) input.value = formData[key]
      }
    })
  }

  form.addEventListener('input', ((): void => {
    inputs.forEach((input: HTMLInputElement): void => {
      if (checkingValue(input)) {
        formData[input.name] = input.value
        sessionStorage.setItem(id, JSON.stringify(formData))
      }
    })
  }) as EventListener)
}

export default (): void => saveFormData('data-save')
