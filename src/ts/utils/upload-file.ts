import { en } from '@utils/en'

interface UploadFile {
  file: File
  url: string
}

type Resolve = (value: UploadFile | PromiseLike<UploadFile>) => void
type Reject = (reason?: string) => void

export const uploadFile = (file: File): Promise<UploadFile> => {
  return new Promise<UploadFile>((resolve: Resolve, reject: Reject): void => {
    const reader: FileReader = new FileReader()
    const createReject = (): void => reject(en ? 'File upload error' : 'Ошибка при загрузке файла')

    reader.readAsDataURL(file)

    reader.addEventListener('loadend', ((): void => {
      reader.result ? resolve({ file, url: reader.result.toString() }) : createReject()
    }) as EventListener)

    reader.addEventListener('error', createReject as EventListener)
  })
}
