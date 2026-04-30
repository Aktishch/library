import { Container, fileHandler, uploadFile } from '@utils'

const dragEvents: string[] = ['dragenter', 'dragover', 'dragleave', 'drop']
const dragClassName: string[] = ['bg-opacity-50']
const labelClassName: string[] = ['pointer-events-none', 'opacity-50']

export default (container: Container = document): void => {
  const previews = container.querySelectorAll('*[data-preview]') as NodeListOf<HTMLDivElement>

  previews.forEach((preview: HTMLDivElement): void => {
    if (!preview) return

    const form = preview.closest('[data-form]') as HTMLFormElement
    const drag = preview.querySelector('*[data-preview-drag]') as HTMLDivElement
    const image = drag.querySelector('*[data-preview-image]') as HTMLImageElement
    const remove = preview.querySelector('*[data-preview-remove]') as HTMLButtonElement
    const label = preview.querySelector('*[data-preview-label]') as HTMLLabelElement
    const input = label.querySelector('*[data-preview-input]') as HTMLInputElement
    const error = preview.querySelector('*[data-error]') as HTMLSpanElement
    const requestUrl: string = String(image.dataset.previewImage)
    let data: DataTransfer = new DataTransfer()

    const uploadFilesList = (): void => {
      input.files = data.files
    }

    const defaultState = (reset: boolean = true): void => {
      drag.classList.remove('pointer-events-none')
      image.src = ''
      remove.disabled = true
      label.classList.remove(...labelClassName)
      data = new DataTransfer()

      if (reset) uploadFilesList()
    }

    const getImagePreview = (files: FileList): void => {
      if (files.length !== 0) {
        uploadFile(files[0] as File).then(({ file, url }): void => {
          if (!fileHandler({ error, file })) return

          drag.classList.add('pointer-events-none')
          image.src = url
          remove.disabled = false
          label.classList.add(...labelClassName)
          data.items.add(file)

          if (form && form.dataset.form === 'avatar') {
            const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement
            const avatar = document.querySelector(`#${preview.dataset.preview}`) as HTMLImageElement

            submitBtn.click()
            avatar.src = url
          }
        })
      }

      uploadFilesList()
    }

    const urlImageToObject = async (): Promise<void> => {
      await fetch(requestUrl)
        .then((response: Response): Promise<Blob> | null => {
          return response.ok ? response.blob() : null
        })
        .then((blob: Blob | null): void => {
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
        .catch((error: string): void => console.log(new Error(error)))
    }

    urlImageToObject().finally((): void => getImagePreview(input.files as FileList))

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
            const files: FileList = (event.dataTransfer as DataTransfer).files

            drag.classList.remove(...dragClassName)
            getImagePreview(files)
            break
          }
        }
      }) as EventListener)
    })

    input.addEventListener('change', ((): void => {
      getImagePreview(input.files as FileList)
    }) as EventListener)

    remove.addEventListener('click', ((): void => {
      defaultState()
    }) as EventListener)

    form.addEventListener('submit', ((event: Event): void => {
      event.preventDefault()

      if ((input.files as FileList).length !== 0) defaultState(false)
    }) as EventListener)
  })
}
