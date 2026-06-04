import { isEn } from '@utils/is-en'

interface FileHandler {
  error: HTMLSpanElement
  file: File
}

interface ErrorMessage {
  type: string
  size: string
}

const ERROR_VISIBLE_CLASSNAMES: string[] = ['invisible', 'opacity-0']
const ALLOWED_TYPES: string[] = ['image/jpeg', 'image/png']
const MAX_FILE_SIZE: number = 2 * Math.pow(1024, 2)
const ERROR_MESSAGE: ErrorMessage = {
  type: isEn ? 'Only jpg or png' : 'Только jpg или png',
  size: isEn ? 'The size is not more than 2 MB' : 'Размер не более 2 мб'
}

export const handleFile = ({ error, file }: FileHandler): boolean => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    error.classList.remove(...ERROR_VISIBLE_CLASSNAMES)
    error.innerText = ERROR_MESSAGE.type
    return false
  }

  if (file.size > MAX_FILE_SIZE) {
    error.classList.remove(...ERROR_VISIBLE_CLASSNAMES)
    error.innerText = ERROR_MESSAGE.size
    return false
  }

  error.classList.add(...ERROR_VISIBLE_CLASSNAMES)
  return true
}
