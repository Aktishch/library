import { Container, getData, getValidate, handleFile, isEn, logError, uploadFile } from '@utils'

type Form = HTMLFormElement | null
type Drag = HTMLDivElement | null
type Image = HTMLImageElement | null
type Remove = HTMLButtonElement | null
type Label = HTMLLabelElement | null
type Input = HTMLInputElement | null
type Error = HTMLSpanElement | null
type Files = FileList | null
type RequestUrl = string | undefined
type SubmitBtn = HTMLButtonElement | null
type Avatar = HTMLImageElement | null

const DATA_PREVIEW: string = getData('preview')
const DRAG_OPACITY_CLASSNAME: string = 'bg-opacity-50'
const DRAG_POINTER_CLASSNAME: string = 'pointer-events-none'
const LABEL_DISABLED_CLASSNAMES: string[] = ['pointer-events-none', 'opacity-50']

const handleElementsError = (): void => {
  logError(
    isEn
      ? `The ${DATA_PREVIEW} does not have a ${DATA_PREVIEW}-(drag, image, remove, label, input, error) child element`
      : `У ${DATA_PREVIEW} отсутствует дочерний элемент ${DATA_PREVIEW}-(drag, image, remove, label, input, error)`
  )
}

export default (container: Container = document): void => {
  const previews: NodeListOf<HTMLDivElement> = container.querySelectorAll(`*[${DATA_PREVIEW}]`)

  if (!previews.length) return

  previews.forEach((preview: HTMLDivElement): void => {
    const form: Form = preview.closest('[data-form]')
    const drag: Drag = preview.querySelector(`*[${DATA_PREVIEW}-drag]`)
    const image: Image = preview.querySelector(`*[${DATA_PREVIEW}-image]`)
    const remove: Remove = preview.querySelector(`*[${DATA_PREVIEW}-remove]`)
    const label: Label = preview.querySelector(`*[${DATA_PREVIEW}-label]`)
    const input: Input = preview.querySelector(`*[${DATA_PREVIEW}-input]`)
    const error: Error = preview.querySelector('*[data-error]')

    if (!drag || !image || !remove || !label || !input || !error) {
      handleElementsError()
      return
    }

    const requestUrl: RequestUrl = image.dataset.previewImage
    let data: DataTransfer = new DataTransfer()

    const assignFileList = (): void => {
      input.files = data.files
    }

    const setDefaultState = (reset: boolean = true): void => {
      drag.classList.remove(DRAG_POINTER_CLASSNAME)
      image.src = ''
      remove.disabled = true
      label.classList.remove(...LABEL_DISABLED_CLASSNAMES)
      data = new DataTransfer()

      if (reset) {
        assignFileList()
      }
    }

    const uploadFileList = async (files: Files): Promise<void> => {
      if (files && files.length) {
        try {
          const { file, url } = await uploadFile(files[0])

          if (!handleFile({ error, file })) {
            throw isEn ? 'File validation failed' : 'Файл не прошёл валидацию'
          }

          drag.classList.add(DRAG_POINTER_CLASSNAME)
          image.src = url
          remove.disabled = false
          label.classList.add(...LABEL_DISABLED_CLASSNAMES)
          data.items.add(file)

          if (form && form.dataset.form === 'avatar') {
            const submitBtn: SubmitBtn = form.querySelector('button[type="submit"]')

            submitBtn?.click()

            if (preview.dataset.preview) {
              const avatar: Avatar = document.querySelector(`*[data-avatar="${preview.dataset.preview}"]`)

              if (avatar) {
                avatar.src = url
              }
            }
          }
        } catch (error: unknown) {
          logError(error as string)
        }
      }

      assignFileList()
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
        assignFileList()
        data = new DataTransfer()
        await uploadFileList(input.files)
      } catch (error: unknown) {
        logError(error as string)
        setDefaultState()
      }
    }

    const setFileList = (event: Event): void => {
      const input: HTMLInputElement = event.target as HTMLInputElement

      uploadFileList(input.files)
    }

    const removeFile = (): void => {
      setDefaultState()
    }

    const resetFileList = (event: Event): void => {
      event.preventDefault()

      const form: HTMLFormElement = event.target as HTMLFormElement

      if (getValidate(form) && form.dataset.form !== 'avatar') {
        setDefaultState(false)
      }
    }

    const onEnter = (event: DragEvent): void => {
      event.preventDefault()
      drag.classList.add(DRAG_OPACITY_CLASSNAME)
    }

    const onLeave = (event: DragEvent): void => {
      event.preventDefault()
      drag.classList.remove(DRAG_OPACITY_CLASSNAME)
    }

    const onDrop = (event: DragEvent): void => {
      event.preventDefault()

      const files: FileList = (event.dataTransfer as DataTransfer).files

      drag.classList.remove(DRAG_OPACITY_CLASSNAME)
      uploadFileList(files)
    }

    handleImage()
    input.addEventListener('change', setFileList as EventListener)
    remove.addEventListener('click', removeFile as EventListener)
    drag.addEventListener('dragenter', onEnter as EventListener)
    drag.addEventListener('dragover', onEnter as EventListener)
    drag.addEventListener('dragleave', onLeave as EventListener)
    drag.addEventListener('drop', onDrop as EventListener)
    form?.addEventListener('submit', resetFileList as EventListener)
  })
}
