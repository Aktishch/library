import { Container, createError, en, fileHandler, uploadFile, validation } from '@utils'

interface Content {
  default: string
  more: string
  limit: string
}

const className: string[] = ['pointer-events-none', 'opacity-50']
const content: Content = {
  default: en ? 'Upload files' : 'Загрузить файлы',
  more: en ? 'Upload more' : 'Загрузить ещё',
  limit: en ? 'No more than 3 files' : 'Не больше 3 файлов',
}

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
    let data: DataTransfer = new DataTransfer()

    const uploadFilesList = (): void => {
      input.files = data.files
    }

    text.textContent = content.default

    input.addEventListener('change', ((): void => {
      const files = input.files as FileList

      if (files.length !== 0) {
        for (let i: number = 0; i < files.length; i++) {
          uploadFile(files[i] as File)
            .then(({ file }): void => {
              if (!fileHandler({ error, file })) return

              if ((data.files as FileList).length < 3) {
                const item = document.createElement('li') as HTMLLIElement

                item.classList.add('flex', 'items-center', 'justify-between', 'gap-5')
                item.setAttribute('data-filelist-item', '')
                item.innerHTML = `
                <span class="truncate">${file.name}</span>
                <button class="btn btn-gray text-sm p-1" data-filelist-remove="${file.name}" data-waved="dark" type="button">
                  <svg class="icon">
                    <use href="/img/icons.svg#close"></use>
                  </svg>
                </button>`
                items.appendChild(item)
                text.textContent = content.more
                data.items.add(file)
              }

              if ((data.files as FileList).length === 3) {
                label.classList.add(...className)
                text.textContent = content.limit
              }
            })
            .catch((error: string): void => createError(error))
        }
      }

      uploadFilesList()
    }) as EventListener)

    filelist.addEventListener('click', ((event: Event): void => {
      if ((event.target as HTMLElement).closest('[data-filelist-remove]')) {
        const remove = event.target as HTMLButtonElement
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
          text.textContent = content.default
        } else {
          label.classList.remove(...className)
          text.textContent = content.more
        }
      }
    }) as EventListener)

    form.addEventListener('submit', ((event: Event): void => {
      event.preventDefault()

      if (validation(form)) {
        label.classList.remove(...className)
        text.textContent = content.default
        items.innerHTML = ''
        data = new DataTransfer()
      }
    }) as EventListener)
  })
}
