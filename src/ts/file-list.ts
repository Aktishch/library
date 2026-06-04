import {
  Container,
  DATA_ERROR,
  DATA_FORM,
  getData,
  getValidate,
  handleFile,
  isEn,
  logError,
  source,
  uploadFile
} from '@utils'

interface Message {
  default: string
  more: string
  limit: string
}

type Form = HTMLFormElement | null
type Label = HTMLLabelElement | null
type Input = HTMLInputElement | null
type Error = HTMLSpanElement | null
type Text = HTMLSpanElement | null
type Listing = HTMLUListElement | null
type Files = FileList | null
type Remove = HTMLButtonElement | null
type Li = HTMLLIElement | null

const DATA_FILELIST: string = getData('filelist')
const LABEL_DISABLED_CLASSNAMES: string[] = ['pointer-events-none', 'opacity-50']

export default (container: Container = document): void => {
  const filelists: NodeListOf<HTMLDivElement> = container.querySelectorAll(`*[${DATA_FILELIST}]`)

  if (!filelists.length) return

  filelists.forEach((filelist: HTMLDivElement): void => {
    const form: Form = filelist.closest(`[${DATA_FORM}]`)
    const label: Label = filelist.querySelector(`*[${DATA_FILELIST}-label]`)
    const input: Input = filelist.querySelector(`*[${DATA_FILELIST}-input]`)
    const error: Error = filelist.querySelector(`*[${DATA_ERROR}]`)
    const text: Text = filelist.querySelector(`*[${DATA_FILELIST}-text]`)
    const listing: Listing = filelist.querySelector(`*[${DATA_FILELIST}-listing]`)

    if (!label || !input || !error || !text || !listing) {
      return logError(
        isEn
          ? `The ${DATA_FILELIST} does not have a ${DATA_FILELIST}-(label, input, error, text, listing) child element`
          : `У ${DATA_FILELIST} отсутствует дочерний элемент ${DATA_FILELIST}-(label, input, error, text, listing)`
      )
    }

    const maxLength: number = Number(listing.dataset.filelistListing) || 3
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
      const files: Files = input.files

      if (files && files.length) {
        for (let i: number = 0; i < files.length; i++) {
          try {
            const { file } = await uploadFile(files[i])

            if (!handleFile({ error, file })) {
              throw isEn ? 'File validation failed' : 'Файл не прошёл валидацию'
            }

            if (data.files.length < maxLength) {
              const li: HTMLLIElement = document.createElement('li')

              li.classList.add('flex', 'items-center', 'justify-between', 'gap-5')
              li.setAttribute(`${DATA_FILELIST}-item`, '')
              li.innerHTML = `
                <span class="truncate">${file.name}</span>
                <button class="btn btn-gray text-sm p-1" ${DATA_FILELIST}-remove="${file.name}-${file.size}" data-waved="dark" type="button">
                  <svg class="icon">
                    <use href="${source}/img/icons.svg#close"></use>
                  </svg>
                </button>
              `
              listing.appendChild(li)
              text.textContent = message.more
              data.items.add(file)
            }

            if (data.files.length === maxLength) {
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
      const remove: Remove = (event.target as HTMLElement).closest(`[${DATA_FILELIST}-remove]`)

      if (!remove) return

      const li: Li = remove.closest(`[${DATA_FILELIST}-item]`)
      const files: FileList = data.files

      data = new DataTransfer()

      for (let i: number = 0; i < files.length; i++) {
        const file: File = files[i]
        const id: string = `${file.name}-${file.size}`

        if (remove.dataset.filelistRemove === id) {
          li?.remove()
        } else {
          data.items.add(file)
        }
      }

      text.textContent = data.files.length === 0 ? message.default : message.more
      uploadFilesList()
      label.classList.remove(...LABEL_DISABLED_CLASSNAMES)
    }) as EventListener)

    form?.addEventListener('submit', ((event: Event): void => {
      event.preventDefault()

      if (getValidate(form)) {
        label.classList.remove(...LABEL_DISABLED_CLASSNAMES)
        text.textContent = message.default
        listing.innerHTML = ''
        data = new DataTransfer()
        uploadFilesList()
      }
    }) as EventListener)
  })
}
