import { Container, getData, getValidate, handleFile, isEn, logError, source, uploadFile } from '@utils'

interface Message {
  default: string
  more: string
  limit: string
}

const DATA_FILELIST: string = getData('filelist')
const LABEL_DISABLED_CLASSNAMES: string[] = ['pointer-events-none', 'opacity-50']

export default (container: Container = document): void => {
  const filelists: NodeListOf<HTMLDivElement> = container.querySelectorAll(`*[${DATA_FILELIST}]`)

  if (!filelists.length) return

  filelists.forEach((filelist: HTMLDivElement): void => {
    const form: HTMLFormElement | null = filelist.closest('[data-form]')
    const label: HTMLLabelElement | null = filelist.querySelector(`*[${DATA_FILELIST}-label]`)
    const input: HTMLInputElement | null = filelist.querySelector(`*[${DATA_FILELIST}-input]`)
    const error: HTMLSpanElement | null = filelist.querySelector('*[data-error]')
    const text: HTMLSpanElement | null = filelist.querySelector(`*[${DATA_FILELIST}-text]`)
    const items: HTMLUListElement | null = filelist.querySelector(`*[${DATA_FILELIST}-items]`)

    if (!label || !input || !error || !text || !items) {
      return logError(
        isEn
          ? `The ${DATA_FILELIST} does not have a ${DATA_FILELIST}-(label, input, error, text, items) child element`
          : `У ${DATA_FILELIST} отсутствует дочерний элемент ${DATA_FILELIST}-(label, input, error, text, items)`
      )
    }

    const maxLength: number = Number(items.dataset.filelistItems) || 3
    const message: Message = {
      default: isEn ? 'Upload files' : 'Загрузить файлы',
      more: isEn ? 'Upload more' : 'Загрузить ещё',
      limit: isEn ? `No more than ${maxLength} files` : `Не больше ${maxLength} файлов`
    }
    let data: DataTransfer = new DataTransfer()

    const uploadFilesList = (): void => {
      input.files = data.files
    }

    text.textContent = message.default

    input.addEventListener('change', (async (): Promise<void> => {
      const files: FileList | null = input.files

      if (files && files.length) {
        for (let i: number = 0; i < files.length; i++) {
          try {
            const { file } = await uploadFile(files[i] as File)

            if (!handleFile({ error, file })) {
              throw isEn ? 'File validation failed' : 'Файл не прошёл валидацию'
            }

            if ((data.files as FileList).length < maxLength) {
              const item: HTMLLIElement = document.createElement('li')

              item.classList.add('flex', 'items-center', 'justify-between', 'gap-5')
              item.setAttribute(`${DATA_FILELIST}-item`, '')
              item.innerHTML = `
                <span class="truncate">${file.name}</span>
                <button class="btn btn-gray text-sm p-1" ${DATA_FILELIST}-remove="${file.name}-${file.size}" data-waved="dark" type="button">
                  <svg class="icon">
                    <use href="${source}/img/icons.svg#close"></use>
                  </svg>
                </button>
              `
              items.appendChild(item)
              text.textContent = message.more
              data.items.add(file)
            }

            if ((data.files as FileList).length === maxLength) {
              label.classList.add(...LABEL_DISABLED_CLASSNAMES)
              text.textContent = message.limit
              break
            }
          } catch (error: unknown) {
            logError(error as string)
          }
        }
      }

      uploadFilesList()
    }) as EventListener)

    filelist.addEventListener('click', ((event: Event): void => {
      const remove: HTMLButtonElement | null = (event.target as HTMLElement).closest(`[${DATA_FILELIST}-remove]`)

      if (!remove) return

      const item: HTMLLIElement | null = remove.closest(`[${DATA_FILELIST}-item]`)
      const files: FileList = data.files

      data = new DataTransfer()

      for (let i: number = 0; i < files.length; i++) {
        const file: File = files[i]
        const id: string = `${file.name}-${file.size}`

        if (remove.dataset.filelistRemove === id) {
          item?.remove()
        } else {
          data.items.add(file)
        }
      }

      text.textContent = (data.files as FileList).length === 0 ? message.default : message.more
      uploadFilesList()
      label.classList.remove(...LABEL_DISABLED_CLASSNAMES)
    }) as EventListener)

    form?.addEventListener('submit', ((event: Event): void => {
      event.preventDefault()

      if (getValidate(form)) {
        label.classList.remove(...LABEL_DISABLED_CLASSNAMES)
        text.textContent = message.default
        items.innerHTML = ''
        data = new DataTransfer()
        uploadFilesList()
      }
    }) as EventListener)
  })
}
