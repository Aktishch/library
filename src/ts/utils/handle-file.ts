import { isEn } from '@utils/is-en'
import { FileType } from '@utils/types'

interface FileHandler {
  file: File
  error: HTMLSpanElement
  type: FileType
  size: number
}

interface ErrorMessage {
  type: string
  size: string
}

const ERROR_VISIBLE_CLASSNAMES: string[] = ['invisible', 'opacity-0']

export const handleFile = ({ file, error, type, size }: FileHandler): boolean => {
  const maxSize: number = size * Math.pow(1024, 2)
  const errorMessage: ErrorMessage = {
    type: '',
    size: isEn ? `The size is not more than ${size} MB` : `Размер не более ${size} мб`
  }
  let allowedTypes: string[] = []

  if (type === 'img') {
    errorMessage.type = isEn ? 'Only jpg or png' : 'Только jpg или png'
    allowedTypes = ['image/jpeg', 'image/png']
  }

  if (type === 'doc') {
    errorMessage.type = isEn ? 'Only pdf, docx, jpg or png' : 'Только pdf, docx, jpg или png'
    allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ]
  }

  if (!allowedTypes.includes(file.type)) {
    error.classList.remove(...ERROR_VISIBLE_CLASSNAMES)
    error.innerText = errorMessage.type
    return false
  }

  if (file.size > maxSize) {
    error.classList.remove(...ERROR_VISIBLE_CLASSNAMES)
    error.innerText = errorMessage.size
    return false
  }

  error.classList.add(...ERROR_VISIBLE_CLASSNAMES)
  return true
}
