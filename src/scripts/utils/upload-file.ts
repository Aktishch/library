import { isRu } from '@utils/is-ru'

interface FileOptions {
  file: File
  url: string
}

export const uploadFile = (file: File) => {
  return new Promise<FileOptions>((resolve, reject) => {
    const reader = new FileReader()

    const setError = () => {
      reject(isRu ? 'Ошибка при загрузке файла' : 'File upload error')
    }

    const readFile = () => {
      if (reader.result) {
        resolve({ file, url: reader.result.toString() })
      } else {
        setError()
      }
    }

    reader.addEventListener('load', readFile)
    reader.addEventListener('error', setError)
    reader.readAsDataURL(file)
  })
}
