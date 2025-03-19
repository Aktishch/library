export type DataSave = { [index: string]: string }

export const saveFormData = (id: string): void => {
  const form = document.querySelector(`#${id}`) as HTMLFormElement

  if (!form) return

  const inputs = form.querySelectorAll('*[data-input]') as NodeListOf<HTMLInputElement>
  let formData: DataSave = {}

  if (sessionStorage.getItem(`${id}`)) {
    formData = JSON.parse(sessionStorage.getItem(`${id}`) || '{}')

    inputs.forEach((input: HTMLInputElement): void => {
      if (input.dataset.input !== 'file' && input.dataset.input !== 'switch') {
        for (const key in formData) if (input.name === key) input.value = formData[key]
      }
    })
  }

  form.addEventListener('input', ((): void => {
    inputs.forEach((input: HTMLInputElement): void => {
      if (input.dataset.input !== 'file' && input.dataset.input !== 'switch') {
        formData[input.name] = input.value
        sessionStorage.setItem(`${id}`, JSON.stringify(formData))
      }
    })
  }) as EventListener)
}

export default (): void => saveFormData('data-save')
