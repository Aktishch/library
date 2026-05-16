import { errors } from '@utils/errors'

type Label = HTMLLabelElement | HTMLDivElement

const inputClassName: string[] = ['input-error']
const errorClassName: string[] = ['invisible', 'opacity-0']

export const getValidate = (form: HTMLFormElement): boolean => {
  const labels = form.querySelectorAll('*[data-label]') as NodeListOf<Label>
  let validate: boolean = true

  labels.forEach((label: Label): void => {
    if (!label) return

    const input = label.querySelector('*[data-input]') as HTMLInputElement
    const error = label.querySelector('*[data-error]') as HTMLSpanElement

    if (!input || !error) return

    const showError = (): void => {
      input.focus()
      input.classList.add(...inputClassName)
      error.classList.remove(...errorClassName)
      validate = false
    }

    const hideError = (): void => {
      input.classList.remove(...inputClassName)
      error.classList.add(...errorClassName)
    }

    const setMaxLengthTel = (value: number): void => {
      if (input.value.length > 0 && input.value.length < value) {
        error.innerText = errors.tel
        showError()
      }
    }

    error.innerText = errors.default

    if (input.value.length === 0) {
      showError()
    } else {
      hideError()
    }

    switch (input.dataset.input) {
      case 'text': {
        if (input.value.length === 1) showError()
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
        if (!/^\s*([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,8})+\s*$/.test(input.value)) {
          error.innerText = errors.email
          showError()
        }

        break
      }

      case 'login': {
        if (!/^[a-zA-Z0-9]+$/.test(input.value)) {
          error.innerText = errors.login
          showError()
        }

        break
      }

      case 'password': {
        if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(input.value)) {
          error.innerText = errors.password
          showError()
        }

        break
      }

      case 'select': {
        if (input.value === 'empty') {
          error.innerText = errors.select
          showError()
        }

        break
      }

      case 'description': {
        if (input.value.length > 0 && input.value.length < 10) {
          error.innerText = errors.text
          showError()
        }

        break
      }

      case 'file': {
        if ((input.files as FileList).length === 0) {
          error.innerText = errors.file.default
          showError()
        }

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
