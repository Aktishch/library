import { errors } from '@utils/errors'

interface HandleFile {
  error: HTMLSpanElement
  file: File
}

const className: string[] = ['invisible', 'opacity-0']
const types: string[] = ['image/jpeg', 'image/png']
const size: number = 2 * Math.pow(1024, 2)

export const handleFile = ({ error, file }: HandleFile): boolean => {
  if (!types.includes(file.type)) {
    error.classList.remove(...className)
    error.innerText = errors.file.type
    return false
  } else if (file.size > size) {
    error.classList.remove(...className)
    error.innerText = errors.file.size
    return false
  } else {
    error.classList.add(...className)
    return true
  }
}
