import { Container, getData, getValidate, handleFile, isEn, logError, uploadFile } from '@utils'

const AVATAR_VALUE = 'avatar'
const DATA_PREVIEW = getData('preview')
const DATA_FORM = getData('form')
const DATA_ERROR = getData('error')
const DATA_AVATAR = getData(AVATAR_VALUE)
const DRAG_OPACITY_CLASSNAME = 'opacity-50'
const DRAG_POINTER_CLASSNAME = 'pointer-events-none'
const LABEL_DISABLED_CLASSNAMES = ['pointer-events-none', 'opacity-50']

export default (container: Container = document) => {
  const previews = container.querySelectorAll<HTMLDivElement>(`*[${DATA_PREVIEW}]`)

  if (!previews.length) return

  previews.forEach((preview) => {
    const form: HTMLFormElement | null = preview.closest(`[${DATA_FORM}]`)
    const drag: HTMLDivElement | null = preview.querySelector(`*[${DATA_PREVIEW}-drag]`)
    const image: HTMLImageElement | null = preview.querySelector(`*[${DATA_PREVIEW}-image]`)
    const remove: HTMLButtonElement | null = preview.querySelector(`*[${DATA_PREVIEW}-remove]`)
    const label: HTMLLabelElement | null = preview.querySelector(`*[${DATA_PREVIEW}-label]`)
    const input: HTMLInputElement | null = preview.querySelector(`*[${DATA_PREVIEW}-input]`)
    const error: HTMLSpanElement | null = preview.querySelector(`*[${DATA_ERROR}]`)

    if (!drag || !image || !remove || !label || !input || !error) {
      logError(
        isEn
          ? `The ${DATA_PREVIEW} does not have a ${DATA_PREVIEW}-(drag, image, remove, label, input, error) child element`
          : `У ${DATA_PREVIEW} отсутствует дочерний элемент ${DATA_PREVIEW}-(drag, image, remove, label, input, error)`
      )
      return
    }

    const type = 'img'
    const size = Number(preview.dataset.size) || 2
    const requestUrl = image.dataset.previewImage
    let data = new DataTransfer()

    const assignFileList = () => {
      input.files = data.files
    }

    const setDefaultState = (reset = true) => {
      drag.classList.remove(DRAG_POINTER_CLASSNAME)
      image.src = ''
      remove.disabled = true
      label.classList.remove(...LABEL_DISABLED_CLASSNAMES)
      data = new DataTransfer()

      if (reset) {
        assignFileList()
      }
    }

    const uploadFileList = async (files: FileList | null) => {
      if (files && files.length) {
        try {
          const { file, url } = await uploadFile(files[0])

          if (!handleFile({ error, file, type, size })) {
            throw isEn ? 'File validation failed' : 'Файл не прошёл валидацию'
          }

          drag.classList.add(DRAG_POINTER_CLASSNAME)
          image.src = url
          remove.disabled = false
          label.classList.add(...LABEL_DISABLED_CLASSNAMES)
          data.items.add(file)

          if (form && form.dataset.form === AVATAR_VALUE) {
            const previewValue = preview.dataset.preview
            const submitBtn: HTMLButtonElement | null = form.querySelector('button[type="submit"]')

            if (previewValue && submitBtn) {
              const avatar: HTMLImageElement | null = document.querySelector(`*[${DATA_AVATAR}="${previewValue}"]`)

              submitBtn.click()

              if (avatar) {
                avatar.src = url
              }
            }
          }
        } catch (error) {
          logError(error as string)
        }
      }

      assignFileList()
    }

    const handleImage = async () => {
      if (!requestUrl) {
        setDefaultState()
        return
      }

      try {
        const response = await fetch(requestUrl)

        if (!response.ok) {
          throw isEn ? 'The path to the image is incorrect' : 'Путь к изображению указан неверно'
        }

        const blob = await response.blob()
        const parts = requestUrl.split('/')
        const name = parts[parts.length - 1]

        data.items.add(new File([blob], name, { type: blob.type }))
        assignFileList()
        data = new DataTransfer()
        await uploadFileList(input.files)
      } catch (error) {
        logError(error as string)
        setDefaultState()
      }
    }

    const setFileList = (event: Event) => {
      const input = event.target as HTMLInputElement

      uploadFileList(input.files)
    }

    const removeFile = () => {
      setDefaultState()
    }

    const resetFileList = (event: Event) => {
      event.preventDefault()

      const form = event.target as HTMLFormElement

      if (getValidate(form) && form.dataset.form !== AVATAR_VALUE) {
        setDefaultState(false)
      }
    }

    const onEnter = (event: DragEvent) => {
      event.preventDefault()
      drag.classList.add(DRAG_OPACITY_CLASSNAME)
    }

    const onLeave = (event: DragEvent) => {
      event.preventDefault()
      drag.classList.remove(DRAG_OPACITY_CLASSNAME)
    }

    const onDrop = (event: DragEvent) => {
      event.preventDefault()

      const { dataTransfer } = event

      if (!dataTransfer) return

      drag.classList.remove(DRAG_OPACITY_CLASSNAME)
      uploadFileList(dataTransfer.files)
    }

    handleImage()
    input.addEventListener('change', setFileList)
    remove.addEventListener('click', removeFile)
    drag.addEventListener('dragenter', onEnter)
    drag.addEventListener('dragover', onEnter)
    drag.addEventListener('dragleave', onLeave)
    drag.addEventListener('drop', onDrop)
    form?.addEventListener('submit', resetFileList)
  })
}
