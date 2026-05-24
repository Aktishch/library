import { Container, getData, getValidate, handleFile, isEn, logError, uploadFile } from '@utils'

const DATA_PREVIEW: string = getData('preview')
const DRAG_EVENTS: string[] = ['dragenter', 'dragover', 'dragover', 'dragleave', 'drop']
const DRAG_OPACITY_CLASSNAME: string = 'bg-opacity-50'
const DRAG_POINTER_CLASSNAME: string = 'pointer-events-none'
const LABEL_DISABLED_CLASSNAMES: string[] = ['pointer-events-none', 'opacity-50']

export default (container: Container = document): void => {
  const previews = container.querySelectorAll(`*[${DATA_PREVIEW}]`) as NodeListOf<HTMLDivElement>

  if (!previews.length) return

  previews.forEach((preview: HTMLDivElement): void => {
    const form = preview.closest('[data-form]') as HTMLFormElement
    const drag = preview.querySelector(`*[${DATA_PREVIEW}-drag]`) as HTMLDivElement
    const image = drag.querySelector(`*[${DATA_PREVIEW}-image]`) as HTMLImageElement
    const remove = preview.querySelector(`*[${DATA_PREVIEW}-remove]`) as HTMLButtonElement
    const label = preview.querySelector(`*[${DATA_PREVIEW}-label]`) as HTMLLabelElement
    const input = label.querySelector(`*[${DATA_PREVIEW}-input]`) as HTMLInputElement
    const error = preview.querySelector('*[data-error]') as HTMLSpanElement
    const requestUrl: string | undefined = image.dataset.previewImage
    let data: DataTransfer = new DataTransfer()

    const uploadFilesList = (): void => {
      input.files = data.files
    }

    const setDefaultState = (reset: boolean = true): void => {
      drag.classList.remove(DRAG_POINTER_CLASSNAME)
      image.src = ''
      remove.disabled = true
      label.classList.remove(...LABEL_DISABLED_CLASSNAMES)
      data = new DataTransfer()

      if (reset) {
        uploadFilesList()
      }
    }

    const setPreview = async (files: FileList): Promise<void> => {
      if (files.length !== 0) {
        try {
          const { file, url } = await uploadFile(files[0] as File)

          if (!handleFile({ error, file })) {
            throw isEn ? 'File validation failed' : 'Файл не прошёл валидацию'
          }

          drag.classList.add(DRAG_POINTER_CLASSNAME)
          image.src = url
          remove.disabled = false
          label.classList.add(...LABEL_DISABLED_CLASSNAMES)
          data.items.add(file)

          if (form && form.dataset.form === 'avatar') {
            const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement

            submitBtn.click()

            if (preview.dataset.preview) {
              const avatar = document.querySelector(`*[data-avatar="${preview.dataset.preview}"]`) as HTMLImageElement

              avatar.src = url
            }
          }
        } catch (error: unknown) {
          logError(error as string)
        }
      }

      uploadFilesList()
    }

    const handleImage = async (): Promise<void> => {
      if (!requestUrl) {
        setDefaultState()
        return
      }

      try {
        const response: Response = await fetch(requestUrl)

        if (!response.ok) {
          throw isEn ? 'The path to the image is incorrect' : 'Путь к изображению указан неверно'
        }

        const blob: Blob = await response.blob()
        const parts: string[] = requestUrl.split('/')
        const name: string = parts[parts.length - 1]

        data.items.add(new File([blob], name, { type: blob.type }))
        uploadFilesList()
        data = new DataTransfer()
        await setPreview(input.files as FileList)
      } catch (error: unknown) {
        logError(error as string)
        setDefaultState()
      }
    }

    handleImage()

    DRAG_EVENTS.forEach((dragEvent: string): void => {
      drag.addEventListener(dragEvent, ((event: DragEvent): void => {
        event.preventDefault()

        switch (event.type) {
          case 'dragenter': {
            drag.classList.add(DRAG_OPACITY_CLASSNAME)
            break
          }

          case 'dragover': {
            drag.classList.add(DRAG_OPACITY_CLASSNAME)
            break
          }

          case 'dragleave': {
            drag.classList.remove(DRAG_OPACITY_CLASSNAME)
            break
          }

          case 'drop': {
            const files: FileList = (event.dataTransfer as DataTransfer).files

            drag.classList.remove(DRAG_OPACITY_CLASSNAME)
            setPreview(files)
            break
          }
        }
      }) as EventListener)
    })

    input.addEventListener('change', ((): void => {
      setPreview(input.files as FileList)
    }) as EventListener)

    remove.addEventListener('click', ((): void => {
      setDefaultState()
    }) as EventListener)

    form.addEventListener('submit', ((event: Event): void => {
      event.preventDefault()

      if (getValidate(form) && form.dataset.form !== 'avatar') {
        setDefaultState(false)
      }
    }) as EventListener)
  })
}
