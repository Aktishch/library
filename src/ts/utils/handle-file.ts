import { errors } from '@utils/errors'

interface FileHandler {
  error: HTMLSpanElement
  file: File
}

const ERROR_VISIBLE_CLASSNAMES: string[] = ['invisible', 'opacity-0']
const ALLOWED_TYPES: string[] = ['image/jpeg', 'image/png']
const MAX_FILE_SIZE: number = 2 * Math.pow(1024, 2)

export const handleFile = ({ error, file }: FileHandler): boolean => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    error.classList.remove(...ERROR_VISIBLE_CLASSNAMES)
    error.innerText = errors.file.type
    return false
  }

  if (file.size > MAX_FILE_SIZE) {
    error.classList.remove(...ERROR_VISIBLE_CLASSNAMES)
    error.innerText = errors.file.size
    return false
  }

  error.classList.add(...ERROR_VISIBLE_CLASSNAMES)
  return true
}
