import { dialog } from '@ts/fancybox'
import { Container, getData, getValidate, logError } from '@utils'

type SubmitBtn = HTMLButtonElement | null

const DATA_FORM: string = getData('form')
const SUBMIT_BUTTON: string = 'button[type="submit"]'
const REQUEST_URL: string = '/ajax/submit-handler.php'

export const setStateSubmitBtn = (container: Container): void => {
  const forms: NodeListOf<HTMLFormElement> = container.querySelectorAll(`*[${DATA_FORM}]`)

  if (!forms.length) return

  forms.forEach((form: HTMLFormElement): void => {
    const submitBtn: SubmitBtn = form.querySelector(SUBMIT_BUTTON)

    if (!submitBtn) return

    const toggles: NodeListOf<HTMLInputElement> = form.querySelectorAll(`*[${DATA_FORM}-toggle]`)

    const togglesChecked = (): void => {
      const allChecked: boolean = ([...toggles] as HTMLInputElement[]).every((toggle: HTMLInputElement): boolean => {
        return toggle.checked
      })

      submitBtn.disabled = !allChecked
    }

    togglesChecked()

    if (toggles.length) {
      toggles.forEach((toggle: HTMLInputElement): void => {
        toggle.addEventListener('change', togglesChecked as EventListener)
      })
    }
  })
}

const submitHandler = async (event: Event): Promise<void> => {
  const form: HTMLFormElement = event.target as HTMLFormElement

  switch (form.dataset.form) {
    case '': {
      if (!getValidate(form)) {
        event.preventDefault()
      }

      break
    }

    default: {
      event.preventDefault()

      if (!getValidate(form)) return

      const formData: FormData = new FormData(form)
      const submitBtn: SubmitBtn = form.querySelector(SUBMIT_BUTTON)

      if (!submitBtn) return

      switch (form.dataset.form) {
        case 'submit': {
          submitBtn.disabled = true
          dialog.notClosing('/dialogs/preloader.html')

          await fetch(REQUEST_URL, {
            method: 'POST',
            body: formData
          })
            .then((response: Response): Promise<{ status: boolean }> => {
              return response.json()
            })
            .then(({ status }): void => {
              dialog.close()
              dialog.open(status ? '/dialogs/success.html' : '/dialogs/error.html')
              form.reset()
              submitBtn.disabled = false
            })
            .catch((error: string): void => {
              logError(error)
            })

          break
        }

        case 'avatar': {
          dialog.notClosing('/dialogs/preloader.html')

          await fetch(REQUEST_URL, {
            method: 'POST',
            body: formData
          })
            .then((response: Response): void => {
              response.text()
            })
            .then((): void => {
              dialog.close()
            })
            .catch((error: string): void => {
              logError(error)
            })

          break
        }

        case 'params': {
          const searchParams: URLSearchParams = new URLSearchParams()

          for (const pair of formData.entries()) {
            searchParams.append(pair[0], String(pair[1]))
          }

          dialog.close()
          dialog.open(`/dialogs/authorization.html?${searchParams.toString()}`)
          break
        }
      }

      break
    }
  }
}

const onSubmit = (event: Event): void => {
  if ((event.target as HTMLElement).hasAttribute(DATA_FORM)) {
    submitHandler(event)
  }
}

const prohibitSubmit = (event: KeyboardEvent): void => {
  if ((event.target as HTMLElement).closest(`[${DATA_FORM}]`)) {
    if (event.code === 'Enter') {
      event.preventDefault()
    }
  }
}

export default (container: Container = document): void => {
  setStateSubmitBtn(container)
  container.addEventListener('submit', onSubmit as EventListener)
  container.addEventListener('keypress', prohibitSubmit as EventListener)
}
