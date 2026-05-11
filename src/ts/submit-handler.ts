import { dialog } from '@ts/fancybox'
import { Container, createError, getValidate } from '@utils'

export const getStateSubmitBtn = (container: Container = document): void => {
  const forms = container.querySelectorAll('*[data-form]') as NodeListOf<HTMLFormElement>

  forms.forEach((form: HTMLFormElement): void => {
    if (!form) return

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement
    const toggles = form.querySelectorAll('*[data-form-toggle]') as NodeListOf<HTMLInputElement>

    const togglesChecked = (): void => {
      const allChecked: boolean = ([...toggles] as HTMLInputElement[]).every(
        (toggle: HTMLInputElement): boolean => toggle.checked
      )

      submitBtn.disabled = !allChecked
    }

    togglesChecked()

    toggles.forEach((toggle: HTMLInputElement): void => {
      if (toggle) toggle.addEventListener('change', togglesChecked as EventListener)
    })
  })
}

const submitHandler = async (event: Event): Promise<void> => {
  const form = event.target as HTMLFormElement

  switch (form.dataset.form) {
    case '': {
      if (!getValidate(form)) event.preventDefault()
      break
    }

    default: {
      event.preventDefault()

      if (!getValidate(form)) return

      const formData: FormData = new FormData(form)
      const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement
      const requestUrl: string = '/ajax/submit-handler.php'

      switch (form.dataset.form) {
        case 'submit': {
          submitBtn.disabled = true
          dialog.notClosing('/dialogs/dialog-preloader.html')

          await fetch(requestUrl, {
            method: 'POST',
            body: formData,
          })
            .then((response: Response): Promise<{ status: boolean }> => {
              return response.json()
            })
            .then((response): void => {
              dialog.close()
              dialog.open(response.status ? '/dialogs/dialog-success.html' : '/dialogs/dialog-error.html')
              form.reset()
              submitBtn.disabled = false
            })
            .catch((error: string): void => createError(error))

          break
        }

        case 'avatar': {
          dialog.notClosing('/dialogs/dialog-preloader.html')

          await fetch(requestUrl, {
            method: 'POST',
            body: formData,
          })
            .then((response: Response): void => {
              response.text()
            })
            .then((): void => {
              dialog.close()
            })
            .catch((error: string): void => createError(error))

          break
        }

        case 'params': {
          const searchParams: URLSearchParams = new URLSearchParams()

          for (const pair of formData.entries()) searchParams.append(pair[0], String(pair[1]))

          const queryString: string = searchParams.toString()

          dialog.close()
          dialog.open(`/dialogs/dialog-authorization.html?${queryString}`)
          break
        }
      }

      break
    }
  }
}

export default (): void => {
  getStateSubmitBtn()

  document.addEventListener('submit', ((event: Event): void => {
    if ((event.target as HTMLFormElement).hasAttribute('data-form')) submitHandler(event)
  }) as EventListener)

  document.addEventListener('keypress', ((event: KeyboardEvent): void => {
    if ((event.target as HTMLFormElement).closest('[data-form]')) {
      if (event.code === 'Enter') event.preventDefault()
    }
  }) as EventListener)
}
