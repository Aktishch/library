import { errors } from './errors'
import { fileHandler } from './file-handler'

type FormLabel = HTMLLabelElement | HTMLDivElement

const inputClassName: string[] = ['input-error']
const errorClassName: string[] = ['invisible', 'opacity-0']

export const validation = (form: HTMLFormElement): boolean => {
  const labels = form.querySelectorAll('*[data-label]') as NodeListOf<FormLabel>
  let validate: boolean = true

  labels.forEach((label: FormLabel): void => {
    if (!label) return

    const input = label.querySelector('*[data-input]') as HTMLInputElement
    const error = label.querySelector('*[data-error]') as HTMLSpanElement

    if (!input || !error) return

    const getError = (): void => {
      input.focus()
      input.classList.add(...inputClassName)
      error.classList.remove(...errorClassName)
      validate = false
    }

    const hideError = (): void => {
      input.classList.remove(...inputClassName)
      error.classList.add(...errorClassName)
    }

    const maxLengthInputTel = (value: number): void => {
      if (input.value.length > 0 && input.value.length < value) {
        error.innerText = errors.tel
        getError()
      }
    }

    error.innerText = errors.default
    input.value.length === 0 ? getError() : hideError()

    switch (input.dataset.input) {
      case 'name': {
        if (input.value.length === 1) getError()
        break
      }

      case 'tel': {
        switch (input.value[0]) {
          case '8': {
            maxLengthInputTel(17)
            break
          }

          case '+': {
            maxLengthInputTel(18)
            break
          }
        }

        break
      }

      case 'email': {
        if (!/^\s*([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,8})+\s*$/.test(input.value)) {
          error.innerText = errors.email
          getError()
        }

        break
      }

      case 'login': {
        if (!/^[a-zA-Z0-9]+$/.test(input.value)) {
          error.innerText = errors.login
          getError()
        }

        break
      }

      case 'password': {
        if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(input.value)) {
          error.innerText = errors.password
          getError()
        }

        break
      }

      case 'select': {
        if (input.value === 'empty') {
          error.innerText = errors.select
          getError()
        }

        break
      }

      case 'text': {
        if (input.value.length > 0 && input.value.length < 10) {
          error.innerText = errors.text
          getError()
        }

        break
      }

      case 'file': {
        const files = input.files as FileList
        const file = files[0] as File

        file && !fileHandler({ error, file }) ? getError() : (error.innerText = errors.file.default)
        break
      }
    }

    input.addEventListener(
      'input',
      ((): void => {
        if (input.value.length > 0) hideError()
      }) as EventListener,
      { once: true }
    )
  })

  return validate
}
