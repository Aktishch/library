import { isEn } from '@utils/is-en'

interface ErrorMessage {
  default: string
  tel: string
  email: string
  login: string
  password: string
  select: string
  description: string
  file: string
}

type Label = HTMLLabelElement | HTMLDivElement

const INPUT_ERROR_CLASSNAME: string = 'input-error'
const ERROR_VISIBLE_CLASSNAMES: string[] = ['invisible', 'opacity-0']
const ERROR_MESSAGE: ErrorMessage = {
  default: isEn ? 'Fill in this field' : 'Заполните это поле',
  tel: isEn ? 'Enter the correct number' : 'Введите корректный номер',
  email: isEn ? 'Enter the correct address' : 'Введите корректный адрес',
  login: isEn ? 'Invalid username' : 'Неверный логин',
  password: isEn ? 'Invalid password' : 'Неверный пароль',
  select: isEn ? 'Choose an option' : 'Выберите вариант',
  description: isEn ? 'Enter at least 10 characters' : 'Введите не менее 10 символов',
  file: isEn ? 'Upload the file' : 'Загрузите файл'
}

export const getValidate = (form: HTMLFormElement): boolean => {
  const labels = form.querySelectorAll('*[data-label]') as NodeListOf<Label>
  let isValid: boolean = true
  let firstInvalidInput: HTMLInputElement | null = null

  if (!labels.length) return isValid

  labels.forEach((label: Label): void => {
    const input = label.querySelector('*[data-input]') as HTMLInputElement
    const error = label.querySelector('*[data-error]') as HTMLSpanElement

    if (!input || !error) return

    let invalidInput: boolean = false

    const showError = (message: string = ERROR_MESSAGE.default): void => {
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
        showError(ERROR_MESSAGE.tel)
      }
    }

    const handleInput = (): void => {
      if (input.value.length > 0) {
        hideError()
        input.removeEventListener('input', handleInput as EventListener)
      }
    }

    input.removeEventListener('input', handleInput as EventListener)

    if (input.type !== 'file' && !input.value.length) {
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
          showError(ERROR_MESSAGE.email)
        }

        break
      }

      case 'login': {
        const regExp: RegExp = /^[a-zA-Z0-9]+$/

        if (!regExp.test(input.value)) {
          showError(ERROR_MESSAGE.login)
        }

        break
      }

      case 'password': {
        const regExp: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

        if (!regExp.test(input.value)) {
          showError(ERROR_MESSAGE.password)
        }

        break
      }

      case 'select': {
        if (input.value === 'empty') {
          showError(ERROR_MESSAGE.select)
        }

        break
      }

      case 'description': {
        if (input.value.length < 10) {
          showError(ERROR_MESSAGE.description)
        }

        break
      }

      case 'file': {
        const files: FileList | null = input.files

        if (!files || !files.length) {
          showError(ERROR_MESSAGE.file)
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
