import { Container, getData, getValidate, handleFile, isEn, logError, source, uploadFile } from '@utils'

const DATA_FILELIST = getData('filelist')
const DATA_FORM = getData('form')
const DATA_ERROR = getData('error')
const LABEL_DISABLED_CLASSNAMES = ['pointer-events-none', 'opacity-50']
const LI_CLASSNAMES = ['flex', 'items-center', 'justify-between', 'gap-5']

export default (container: Container = document) => {
  const filelists = container.querySelectorAll<HTMLDivElement>(`*[${DATA_FILELIST}]`)

  if (!filelists.length) return

  filelists.forEach((filelist) => {
    const form: HTMLFormElement | null = filelist.closest(`[${DATA_FORM}`)
    const label: HTMLLabelElement | null = filelist.querySelector(`*[${DATA_FILELIST}-label]`)
    const input: HTMLInputElement | null = filelist.querySelector(`*[${DATA_FILELIST}-input]`)
    const error: HTMLSpanElement | null = filelist.querySelector(`*[${DATA_ERROR}]`)
    const text: HTMLSpanElement | null = filelist.querySelector(`*[${DATA_FILELIST}-text]`)
    const listing: HTMLUListElement | null = filelist.querySelector(`*[${DATA_FILELIST}-listing]`)

    if (!label || !input || !error || !text || !listing) {
      logError(
        isEn
          ? `The ${DATA_FILELIST} does not have a ${DATA_FILELIST}-(label, input, error, text, listing) child element`
          : `У ${DATA_FILELIST} отсутствует дочерний элемент ${DATA_FILELIST}-(label, input, error, text, listing)`
      )
      return
    }

    const value = filelist.dataset.type
    const type = value === 'img' || value === 'doc' ? value : 'img'
    const size = Number(filelist.dataset.size) || 2
    const maxLength = Number(listing.dataset.filelistListing) || 3
    const message = {
      default: isEn ? 'Upload files' : 'Загрузить файлы',
      more: isEn ? 'Upload more' : 'Загрузить ещё',
      limit: isEn ? `No more than ${maxLength} files` : `Не больше ${maxLength} файлов`
    }
    let data = new DataTransfer()

    const assignFileList = () => {
      input.files = data.files
    }

    const uploadFileList = async (event: Event) => {
      const files = (event.target as HTMLInputElement).files

      if (files && files.length) {
        for (let i = 0; i < files.length; i++) {
          try {
            const { file } = await uploadFile(files[i])

            if (!handleFile({ error, file, type, size })) {
              throw isEn ? 'File validation failed' : 'Файл не прошёл валидацию'
            }

            if (data.files.length < maxLength) {
              const li = document.createElement('li')

              li.classList.add(...LI_CLASSNAMES)
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
          } catch (error) {
            logError(error as string)
          }
        }
      }

      assignFileList()
    }

    const removeFileInList = (event: Event) => {
      const remove: HTMLButtonElement | null = (event.target as HTMLElement).closest(`[${DATA_FILELIST}-remove]`)

      if (!remove) return

      const li: HTMLLIElement | null = remove.closest(`[${DATA_FILELIST}-item]`)
      const files = data.files

      data = new DataTransfer()

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const id = `${file.name}-${file.size}`

        if (remove.dataset.filelistRemove === id) {
          li?.remove()
        } else {
          data.items.add(file)
        }
      }

      text.textContent = !data.files.length ? message.default : message.more
      assignFileList()
      label.classList.remove(...LABEL_DISABLED_CLASSNAMES)
    }

    const resetFileList = (event: Event) => {
      event.preventDefault()

      if (getValidate(event.target as HTMLFormElement)) {
        label.classList.remove(...LABEL_DISABLED_CLASSNAMES)
        text.textContent = message.default
        listing.innerHTML = ''
        data = new DataTransfer()
      }
    }

    text.textContent = message.default
    input.addEventListener('change', uploadFileList)
    filelist.addEventListener('click', removeFileInList)
    form?.addEventListener('submit', resetFileList)
  })
}
