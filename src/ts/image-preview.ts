import { dialog } from './fancybox'
import { fileHandler, uploadFile } from './utils'

export default (): void => {
  const previews = document.querySelectorAll('*[data-preview]') as NodeListOf<HTMLFormElement>

  previews.forEach((preview: HTMLFormElement): void => {
    if (!preview) return

    const label = preview.querySelector('*[data-preview-label]') as HTMLLabelElement
    const image = preview.querySelector('*[data-preview-image]') as HTMLImageElement
    const remove = preview.querySelector('*[data-preview-remove]') as HTMLButtonElement
    const input = label.querySelector('*[data-preview-input]') as HTMLInputElement
    const error = preview.querySelector('*[data-error]') as HTMLSpanElement
    const drag = preview.querySelector('*[data-preview-drag]') as HTMLDivElement
    const requestUrl: string = image.dataset.previewImage
    let data = new DataTransfer() as DataTransfer

    const uploadFilesList = (): void => {
      input.files = data.files as FileList
    }

    const defaultState = (): void => {
      image.src = ''
      remove.disabled = true
      label.classList.remove('pointer-events-none', 'opacity-50')
      data = new DataTransfer() as DataTransfer
      input.value = ''
    }

    const getImagePreview = (files: FileList): void => {
      if (files.length !== 0) {
        uploadFile(files[0] as File).then(({ file, url }): void => {
          if (!fileHandler({ error, file })) return

          image.src = url
          remove.disabled = false
          label.classList.add('pointer-events-none', 'opacity-50')
          data.items.add(file)
          uploadFilesList()

          if (preview.dataset.preview === 'avatar') {
            const formData = new FormData(preview) as FormData
            const requestUrl: string = '/ajax/submit-handler.php'
            const avatar = document.querySelector('*[data-avatar]') as HTMLImageElement

            dialog.notClosing('/dialogs/dialog-preloader.html')

            fetch(requestUrl, {
              method: 'POST',
              body: formData,
            })
              .then((response: Response): void => {
                response.text()
              })
              .then((): void => {
                avatar.src = url
                dialog.close()
              })
              .catch((error: string): void => console.log('The form has not been sent', error))
          }
        })
      } else {
        uploadFilesList()
      }
    }

    const urlImageToObject = async (): Promise<void> => {
      await fetch(requestUrl)
        .then((response: Response): Promise<Blob> => {
          return response.ok ? response.blob() : null
        })
        .then((blob: Blob): void => {
          if (blob && requestUrl !== '') {
            const parts: string[] = requestUrl.split('/')
            const name: string = parts[parts.length - 1]

            data.items.add(new File([blob], name, { type: blob.type }))
            uploadFilesList()
            getImagePreview(input.files)
          } else {
            defaultState()
          }
        })
    }

    urlImageToObject()

    if (drag) {
      const dragEvents: string[] = ['dragenter', 'dragover', 'dragleave', 'drop']

      dragEvents.forEach((dragEvent: string): void => {
        drag.addEventListener(dragEvent, ((event: DragEvent): void => {
          event.preventDefault()

          switch (event.type) {
            case 'dragenter': {
              drag.classList.add('bg-opacity-50')
              break
            }

            case 'dragleave': {
              drag.classList.remove('bg-opacity-50')
              break
            }

            case 'drop': {
              const files = (event.dataTransfer as DataTransfer).files as FileList

              drag.classList.remove('bg-opacity-50')
              getImagePreview(files)
              break
            }
          }
        }) as EventListener)
      })
    }

    input.addEventListener('change', ((): void => {
      const files = input.files as FileList

      getImagePreview(files)
    }) as EventListener)

    remove.addEventListener('click', defaultState as EventListener)
  })
}
