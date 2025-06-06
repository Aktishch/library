import { fileHandler } from './file-handler'

type FormLabel = HTMLLabelElement | HTMLDivElement

export const validation = (form: HTMLFormElement): boolean => {
  const labels = form.querySelectorAll('*[data-label]') as NodeListOf<FormLabel>
  let validate: boolean = true

  labels.forEach((label: FormLabel): void => {
    if (!label) return

    const input = label.querySelector('*[data-input]') as HTMLInputElement
    const error = label.querySelector('*[data-error]') as HTMLSpanElement

    if (!input && !error) return

    const getError = (): void => {
      input.focus()
      input.classList.add('input-error')
      error.classList.remove('invisible', 'opacity-0')
      validate = false
    }

    const hideError = (): void => {
      input.classList.remove('input-error')
      error.classList.add('invisible', 'opacity-0')
    }

    const maxLengthInputTel = (value: number): void => {
      if (input.value.length > 0 && input.value.length < value) {
        error.innerText = 'Введите корректный номер'
        getError()
      }
    }

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

          default: {
            error.innerText = 'Введите ваш номер'
            break
          }
        }

        break
      }

      case 'email': {
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,8})+$/.test(input.value)) getError()
        break
      }

      case 'login': {
        if (!/^[a-zA-Z0-9]+$/.test(input.value)) getError()

        break
      }

      case 'password': {
        if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(input.value)) getError()

        break
      }

      case 'select': {
        if (input.value === 'empty') getError()
        break
      }

      case 'text': {
        if (input.value.length > 0 && input.value.length < 10) {
          error.innerText = 'Введите не менее 10 символов'
          getError()
        } else {
          error.innerText = 'Заполните это поле'
        }

        break
      }

      case 'file': {
        const files = input.files as FileList
        const file = files[0] as File

        if (file && !fileHandler({ error, file })) {
          getError()
        } else {
          error.innerText = 'Загрузите файл'
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
