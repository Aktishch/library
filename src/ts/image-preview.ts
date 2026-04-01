import { dialog } from './fancybox'
import { fileHandler, uploadFile } from './utils'

const dragClassName: string[] = ['bg-opacity-50']
const labelClassName: string[] = ['pointer-events-none', 'opacity-50']

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
    let data: DataTransfer = new DataTransfer()

    const uploadFilesList = (): void => {
      input.files = data.files
    }

    const defaultState = (): void => {
      image.src = ''
      remove.disabled = true
      label.classList.remove(...labelClassName)
      data = new DataTransfer()
      uploadFilesList()

      if (drag) drag.classList.remove('pointer-events-none')
    }

    const getImagePreview = (files: FileList): void => {
      if (files.length !== 0) {
        uploadFile(files[0] as File).then(({ file, url }): void => {
          if (!fileHandler({ error, file })) return

          image.src = url
          remove.disabled = false
          label.classList.add(...labelClassName)
          data.items.add(file)

          if (drag) drag.classList.add('pointer-events-none')

          if (preview.dataset.preview === 'avatar') {
            const formData: FormData = new FormData(preview)
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
              .catch((error: string): void => console.log(error))
          }
        })
      }

      uploadFilesList()
    }

    const urlImageToObject = async (): Promise<void> => {
      await fetch(requestUrl)
        .then((response: Response): Promise<Blob | null> => {
          return response.ok ? response.blob() : null
        })
        .then((blob: Blob): void => {
          if (blob && requestUrl !== '') {
            const parts: string[] = requestUrl.split('/')
            const name: string = parts[parts.length - 1]

            data.items.add(new File([blob], name, { type: blob.type }))
            input.files = data.files
            data = new DataTransfer()
          } else {
            defaultState()
          }
        })
        .catch((error: string): void => console.log(error))
    }

    urlImageToObject().finally((): void => getImagePreview(input.files))

    if (drag) {
      const dragEvents: string[] = ['dragenter', 'dragover', 'dragleave', 'drop']

      dragEvents.forEach((dragEvent: string): void => {
        drag.addEventListener(dragEvent, ((event: DragEvent): void => {
          event.preventDefault()

          switch (event.type) {
            case 'dragenter': {
              drag.classList.add(...dragClassName)
              break
            }

            case 'dragleave': {
              drag.classList.remove(...dragClassName)
              break
            }

            case 'drop': {
              const files = (event.dataTransfer as DataTransfer).files as FileList

              drag.classList.remove(...dragClassName)
              getImagePreview(files)
              break
            }
          }
        }) as EventListener)
      })
    }

    input.addEventListener('change', ((): void => {
      getImagePreview(input.files)
    }) as EventListener)

    remove.addEventListener('click', defaultState as EventListener)
  })
}
