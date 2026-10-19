import { getData } from '@utils/get-data'
import { isRu } from '@utils/is-ru'

const DATA_LABEL = getData('label')
const DATA_INPUT = getData('input')
const DATA_ERROR = getData('error')
const INPUT_ERROR_CLASSNAME = 'input-red!'
const ERROR_VISIBLE_CLASSNAMES = ['invisible', 'opacity-0']
const ERROR_MESSAGE = {
  default: isRu ? 'Заполните это поле' : 'Fill in this field',
  tel: isRu ? 'Введите корректный номер' : 'Enter the correct number',
  email: isRu ? 'Введите корректный адрес' : 'Enter the correct address',
  login: isRu ? 'Неверный логин' : 'Invalid username',
  password: isRu ? 'Неверный пароль' : 'Invalid password',
  select: isRu ? 'Выберите вариант' : 'Choose an option',
  description: isRu ? 'Введите не менее 10 символов' : 'Enter at least 10 characters',
  file: isRu ? 'Загрузите файл' : 'Upload the file'
}

export const getValidate = (form: HTMLFormElement) => {
  const labels = form.querySelectorAll<HTMLLabelElement | HTMLDivElement>(`*[${DATA_LABEL}]`)
  let isValid = true
  let firstInvalidInput: HTMLInputElement | null = null

  if (!labels.length) return isValid

  labels.forEach((label) => {
    const input: HTMLInputElement | null = label.querySelector(`*[${DATA_INPUT}]`)
    const error: HTMLSpanElement | null = label.querySelector(`*[${DATA_ERROR}]`)

    if (!input || !error) return

    let invalidInput = false

    const showError = (message = ERROR_MESSAGE.default) => {
      invalidInput = true
      input.classList.add(INPUT_ERROR_CLASSNAME)
      error.classList.remove(...ERROR_VISIBLE_CLASSNAMES)
      error.innerText = message
      isValid = false

      if (!firstInvalidInput) {
        firstInvalidInput = input
      }
    }

    const hideError = () => {
      input.classList.remove(INPUT_ERROR_CLASSNAME)
      error.classList.add(...ERROR_VISIBLE_CLASSNAMES)
    }

    const setMaxLengthTel = (value: number) => {
      if (input.value.length > 0 && input.value.length < value) {
        showError(ERROR_MESSAGE.tel)
      }
    }

    const handleInput = () => {
      if (input.value.length > 0) {
        hideError()
        input.removeEventListener('input', handleInput)
      }
    }

    input.removeEventListener('input', handleInput)

    if (input.type !== 'file' && !input.value.length) {
      showError()
      input.addEventListener('input', handleInput)
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
        const regExp = /^\s*([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,8})+\s*$/

        if (!regExp.test(input.value)) {
          showError(ERROR_MESSAGE.email)
        }

        break
      }

      case 'login': {
        const regExp = /^[a-zA-Z0-9]+$/

        if (!regExp.test(input.value)) {
          showError(ERROR_MESSAGE.login)
        }

        break
      }

      case 'password': {
        const regExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

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
        const files = input.files

        if (!files || !files.length) {
          showError(ERROR_MESSAGE.file)
        }

        break
      }
    }

    if (invalidInput) {
      input.addEventListener('input', handleInput)
    }
  })

  if (firstInvalidInput) {
    ;(firstInvalidInput as HTMLInputElement).focus()
  }

  return isValid
}
