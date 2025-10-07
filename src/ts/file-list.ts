import { fileHandler, uploadFile } from './utils'

export default () => {
  const filelists = document.querySelectorAll('*[data-filelist]') as NodeListOf<HTMLDivElement>

  filelists.forEach((filelist: HTMLDivElement): void => {
    if (!filelist) return

    const label = filelist.querySelector('*[data-filelist-label]') as HTMLLabelElement
    const input = label.querySelector('*[data-filelist-input]') as HTMLInputElement
    const error = filelist.querySelector('*[data-error]') as HTMLSpanElement
    const text = label.querySelector('*[data-filelist-text]') as HTMLSpanElement
    const items = filelist.querySelector('*[data-filelist-items]') as HTMLUListElement
    let data = new DataTransfer() as DataTransfer

    const uploadFilesList = (): void => {
      input.files = data.files as FileList
    }

    input.addEventListener('change', ((): void => {
      const files = input.files as FileList

      if (files.length !== 0) {
        for (let i: number = 0; i < files.length; i++) {
          uploadFile(files[i] as File).then(({ file }): void => {
            if (!fileHandler({ error, file })) return

            if ((data.files as FileList).length < 3) {
              const item = document.createElement('li') as HTMLLIElement

              item.classList.add('flex', 'items-center', 'justify-between', 'gap-5')
              item.setAttribute('data-filelist-item', '')
              item.innerHTML = `
                <span class="truncate">${file.name}</span>
                <button class="btn btn-gray text-sm p-1" data-filelist-remove="${file.name}" data-waved="dark" type="button">
                  <svg class="icon">
                    <use xlink:href="/img/icons.svg#close"></use>
                  </svg>
                </button>`
              items.appendChild(item)
              text.textContent = 'Загрузить ещё'
              data.items.add(file)
            }

            if ((data.files as FileList).length === 3) {
              label.classList.add('pointer-events-none', 'opacity-50')
              text.textContent = 'Не больше 3 файлов'
            }

            uploadFilesList()
          })
        }
      } else {
        uploadFilesList()
      }
    }) as EventListener)

    filelist.addEventListener('click', ((event: Event): void => {
      if ((event.target as HTMLButtonElement).closest('[data-filelist-remove]')) {
        const remove = event.target as HTMLButtonElement
        const item = remove.closest('[data-filelist-item]') as HTMLLIElement
        const files = data.files as FileList

        data = new DataTransfer() as DataTransfer

        for (let i: number = 0; i < files.length; i++) {
          const file = files[i] as File

          if (remove.dataset.filelistRemove === file.name) {
            item.remove()
          } else {
            data.items.add(file)
            uploadFilesList()
          }
        }

        if ((data.files as FileList).length === 0) {
          input.value = ''
          text.textContent = 'Загрузить файлы'
        } else {
          label.classList.remove('pointer-events-none', 'opacity-50')
          text.textContent = 'Загрузить ещё'
        }
      }
    }) as EventListener)
  })
}
