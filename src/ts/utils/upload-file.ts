import { isEn } from '@utils/is-en'

type Resolve = (value: UploadedFile | PromiseLike<UploadedFile>) => void
type Reject = (reason?: string) => void

interface UploadedFile {
  file: File
  url: string
}

export const uploadFile = (file: File): Promise<UploadedFile> => {
  return new Promise<UploadedFile>((resolve: Resolve, reject: Reject): void => {
    const reader: FileReader = new FileReader()

    const setError = (): void => {
      reject(isEn ? 'File upload error' : 'Ошибка при загрузке файла')
    }

    const readFile = (): void => {
      if (reader.result) {
        resolve({ file, url: reader.result.toString() })
      } else {
        setError()
      }
    }

    reader.addEventListener('load', readFile as EventListener)
    reader.addEventListener('error', setError as EventListener)
    reader.readAsDataURL(file)
  })
}
