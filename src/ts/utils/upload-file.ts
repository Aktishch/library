import { isEn } from '@utils/is-en'

interface UploadedFile {
  file: File
  url: string
}

type Resolve = (value: UploadedFile | PromiseLike<UploadedFile>) => void
type Reject = (reason?: string) => void

export const uploadFile = (file: File): Promise<UploadedFile> => {
  return new Promise<UploadedFile>((resolve: Resolve, reject: Reject): void => {
    const reader: FileReader = new FileReader()
    const setReject = (): void => reject(isEn ? 'File upload error' : 'Ошибка при загрузке файла')

    reader.readAsDataURL(file)

    reader.addEventListener('loadend', ((): void => {
      reader.result ? resolve({ file, url: reader.result.toString() }) : setReject()
    }) as EventListener)

    reader.addEventListener('error', setReject as EventListener)
  })
}
