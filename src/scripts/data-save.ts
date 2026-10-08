import { getData, isEn, logError } from '@utils'

const DATA_SAVE = getData('save')

const handleInput = (input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
  return !input || input.hasAttribute('hidden') || input.type === 'hidden' || input.type === 'file'
}

export default (container: Document | HTMLElement = document) => {
  const forms = container.querySelectorAll<HTMLFormElement>(`*[${DATA_SAVE}]`)

  if (!forms.length) return

  forms.forEach((form) => {
    const value = form.dataset.save

    if (!value) {
      logError(isEn ? `${DATA_SAVE} is missing a value` : `У ${DATA_SAVE} отсутствует значение`)
      return
    }

    const dataSave: Record<string, string | boolean> = JSON.parse(sessionStorage.getItem(value) || '{}')
    const inputs = [
      ...form.querySelectorAll('input'),
      ...form.querySelectorAll('select'),
      ...form.querySelectorAll('textarea')
    ]

    const enterData = () => {
      inputs.forEach((input) => {
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
      inputs.forEach((input) => {
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
