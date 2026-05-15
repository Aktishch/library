import { Container, createError, getValidate, handleFile, isEn, isSource, uploadFile } from '@utils'

interface Message {
  default: string
  more: string
  limit: string
}

const className: string[] = ['pointer-events-none', 'opacity-50']

export default (container: Container = document): void => {
  const filelists = container.querySelectorAll('*[data-filelist]') as NodeListOf<HTMLDivElement>

  filelists.forEach((filelist: HTMLDivElement): void => {
    if (!filelist) return

    const form = filelist.closest('[data-form]') as HTMLFormElement
    const label = filelist.querySelector('*[data-filelist-label]') as HTMLLabelElement
    const input = label.querySelector('*[data-filelist-input]') as HTMLInputElement
    const error = filelist.querySelector('*[data-error]') as HTMLSpanElement
    const text = label.querySelector('*[data-filelist-text]') as HTMLSpanElement
    const items = filelist.querySelector('*[data-filelist-items]') as HTMLUListElement
    const maxLength: number = Number(items.dataset.filelistItems) || 3
    const message: Message = {
      default: isEn ? 'Upload files' : 'Загрузить файлы',
      more: isEn ? 'Upload more' : 'Загрузить ещё',
      limit: isEn ? `No more than ${maxLength} files` : `Не больше ${maxLength} файлов`,
    }
    let data: DataTransfer = new DataTransfer()

    const uploadFilesList = (): void => {
      input.files = data.files
    }

    text.textContent = message.default

    input.addEventListener('change', ((): void => {
      const files = input.files as FileList

      if (files.length !== 0) {
        for (let i: number = 0; i < files.length; i++) {
          uploadFile(files[i] as File)
            .then(({ file }): void => {
              if (!handleFile({ error, file })) return

              if ((data.files as FileList).length < maxLength) {
                const item = document.createElement('li') as HTMLLIElement

                item.classList.add('flex', 'items-center', 'justify-between', 'gap-5')
                item.setAttribute('data-filelist-item', '')
                item.innerHTML = `
                <span class="truncate">${file.name}</span>
                <button class="btn btn-gray text-sm p-1" data-filelist-remove="${file.name}" data-waved="dark" type="button">
                  <svg class="icon">
                    <use href="${isSource}/img/icons.svg#close"></use>
                  </svg>
                </button>`
                items.appendChild(item)
                text.textContent = message.more
                data.items.add(file)
              }

              if ((data.files as FileList).length === maxLength) {
                label.classList.add(...className)
                text.textContent = message.limit
              }
            })
            .catch((error: string): void => createError(error))
        }
      }

      uploadFilesList()
    }) as EventListener)

    filelist.addEventListener('click', ((event: Event): void => {
      const remove = event.target as HTMLButtonElement

      if (remove.closest('[data-filelist-remove]')) {
        const item = remove.closest('[data-filelist-item]') as HTMLLIElement
        const files: FileList = data.files

        data = new DataTransfer()

        for (let i: number = 0; i < files.length; i++) {
          const file: File = files[i]

          if (remove.dataset.filelistRemove === file.name) {
            item.remove()
          } else {
            data.items.add(file)
            uploadFilesList()
          }
        }

        if ((data.files as FileList).length === 0) {
          input.value = ''
          text.textContent = message.default
        } else {
          text.textContent = message.more
        }

        label.classList.remove(...className)
      }
    }) as EventListener)

    form.addEventListener('submit', ((event: Event): void => {
      event.preventDefault()

      if (getValidate(form)) {
        label.classList.remove(...className)
        text.textContent = message.default
        items.innerHTML = ''
        data = new DataTransfer()
      }
    }) as EventListener)
  })
}
