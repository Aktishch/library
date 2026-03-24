import { errors } from './errors'

type FileHandler = {
  error: HTMLSpanElement
  file: File
}

const className: string[] = ['invisible', 'opacity-0']

export const fileHandler = ({ error, file }: FileHandler): boolean => {
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    error.classList.remove(...className)
    error.innerText = errors.file.type
    return false
  } else if (file.size > 2 * Math.pow(1024, 2)) {
    error.classList.remove(...className)
    error.innerText = errors.file.size
    return false
  } else {
    error.classList.add(...className)
    return true
  }
}
