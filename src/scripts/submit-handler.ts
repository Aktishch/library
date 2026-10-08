import { dialog, getDialogSrc } from '@scripts/fancybox'
import { getData, getValidate, logError } from '@utils'

const DATA_FORM = getData('form')
const SUBMIT_BUTTON = 'button[type="submit"]'
const REQUEST_URL = '/ajax/submit-handler.php'

export const setStateSubmitBtn = (container: Document | HTMLElement) => {
  const forms = container.querySelectorAll<HTMLFormElement>(`*[${DATA_FORM}]`)

  if (!forms.length) return

  forms.forEach((form) => {
    const submitBtn: HTMLButtonElement | null = form.querySelector(SUBMIT_BUTTON)

    if (!submitBtn) return

    const toggles = form.querySelectorAll<HTMLInputElement>(`*[${DATA_FORM}-toggle]`)

    const togglesChecked = () => {
      const allChecked = ([...toggles] as HTMLInputElement[]).every((toggle) => {
        return toggle.checked
      })

      submitBtn.disabled = !allChecked
    }

    togglesChecked()

    if (toggles.length) {
      toggles.forEach((toggle) => {
        toggle.addEventListener('change', togglesChecked)
      })
    }
  })
}

const submitHandler = async (event: Event) => {
  const form = event.target as HTMLFormElement

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

      const formData = new FormData(form)
      const submitBtn: HTMLButtonElement | null = form.querySelector(SUBMIT_BUTTON)

      if (!submitBtn) return

      switch (form.dataset.form) {
        case 'submit': {
          submitBtn.disabled = true
          dialog.notClosing(getDialogSrc('preloader'))

          await fetch(REQUEST_URL, {
            method: 'POST',
            body: formData
          })
            .then((response): Promise<{ status: boolean }> => {
              return response.json()
            })
            .then(({ status }) => {
              dialog.close()
              dialog.open(status ? getDialogSrc('success') : getDialogSrc('error'))
              form.reset()
              submitBtn.disabled = false
            })
            .catch((error: string) => {
              logError(error)
            })

          break
        }

        case 'avatar': {
          dialog.notClosing(getDialogSrc('preloader'))

          await fetch(REQUEST_URL, {
            method: 'POST',
            body: formData
          })
            .then((response) => {
              response.text()
            })
            .then(() => {
              dialog.close()
            })
            .catch((error: string) => {
              logError(error)
            })

          break
        }

        case 'params': {
          const searchParams = new URLSearchParams()

          for (const pair of formData.entries()) {
            searchParams.append(pair[0], String(pair[1]))
          }

          dialog.close()
          dialog.open(`${getDialogSrc('authorization')}?${searchParams.toString()}`)
          break
        }
      }

      break
    }
  }
}

const onSubmit = (event: Event) => {
  if ((event.target as HTMLElement).hasAttribute(DATA_FORM)) {
    submitHandler(event)
  }
}

const prohibitSubmit = (event: KeyboardEvent) => {
  if ((event.target as HTMLElement).closest(`[${DATA_FORM}]`)) {
    if (event.code === 'Enter') {
      event.preventDefault()
    }
  }
}

export default (container: Document | HTMLElement = document) => {
  setStateSubmitBtn(container)
  container.addEventListener('submit', onSubmit)
  container.addEventListener('keypress', prohibitSubmit as EventListener)
}
