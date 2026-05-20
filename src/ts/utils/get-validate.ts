import { errors } from '@utils/errors'

type Label = HTMLLabelElement | HTMLDivElement

const INPUT_ERROR_CLASSNAME: string = 'input-error'
const ERROR_VISIBLE_CLASSNAMES: string[] = ['invisible', 'opacity-0']

export const getValidate = (form: HTMLFormElement): boolean => {
  const labels = form.querySelectorAll('*[data-label]') as NodeListOf<Label>
  let isValid: boolean = true
  let firstInvalidInput: HTMLInputElement | null = null

  labels.forEach((label: Label): void => {
    if (!label) return

    const input = label.querySelector('*[data-input]') as HTMLInputElement
    const error = label.querySelector('*[data-error]') as HTMLSpanElement

    if (!input || !error) return

    let invalidInput: boolean = false

    const showError = (message: string = errors.default): void => {
      invalidInput = true
      input.classList.add(INPUT_ERROR_CLASSNAME)
      error.classList.remove(...ERROR_VISIBLE_CLASSNAMES)
      error.innerText = message
      isValid = false

      if (!firstInvalidInput) {
        firstInvalidInput = input
      }
    }

    const hideError = (): void => {
      input.classList.remove(INPUT_ERROR_CLASSNAME)
      error.classList.add(...ERROR_VISIBLE_CLASSNAMES)
    }

    const setMaxLengthTel = (value: number): void => {
      if (input.value.length > 0 && input.value.length < value) {
        showError(errors.tel)
      }
    }

    const handleInput = (): void => {
      if (input.value.length > 0) {
        hideError()
        input.removeEventListener('input', handleInput as EventListener)
      }
    }

    input.removeEventListener('input', handleInput as EventListener)

    if (input.value.length === 0) {
      showError()
      input.addEventListener('input', handleInput as EventListener)
      return
    }

    hideError()

    switch (input.dataset.input) {
      case 'text': {
        if (input.value.length === 1) {
          showError()
        }

        break
      }

      case 'tel': {
        switch (input.value[0]) {
          case '8': {
            setMaxLengthTel(17)
            break
          }

          case '+': {
            setMaxLengthTel(18)
            break
          }
        }

        break
      }

      case 'email': {
        const regExp: RegExp = /^\s*([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,8})+\s*$/

        if (!regExp.test(input.value)) {
          showError(errors.email)
        }

        break
      }

      case 'login': {
        const regExp: RegExp = /^[a-zA-Z0-9]+$/

        if (!regExp.test(input.value)) {
          showError(errors.login)
        }

        break
      }

      case 'password': {
        const regExp: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

        if (!regExp.test(input.value)) {
          showError(errors.password)
        }

        break
      }

      case 'select': {
        if (input.value === 'empty') {
          showError(errors.select)
        }

        break
      }

      case 'description': {
        if (input.value.length < 10) {
          showError(errors.description)
        }

        break
      }

      case 'file': {
        if ((input.files as FileList).length === 0) {
          showError(errors.file.default)
        }

        break
      }
    }

    if (invalidInput) {
      input.addEventListener('input', handleInput as EventListener)
    }
  })

  if (firstInvalidInput) {
    ;(firstInvalidInput as HTMLInputElement).focus()
  }

  return isValid
}
