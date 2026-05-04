import { createError, en } from '@utils'

interface LoadTimePreloader {
  item: HTMLDivElement
  ms: number
}

type Resolve = (value: HTMLDivElement | PromiseLike<HTMLDivElement>) => void
type Reject = (reason?: string) => void

const loadTimePreloader = ({ item, ms }: LoadTimePreloader): Promise<HTMLDivElement> => {
  return new Promise((resolve: Resolve, reject: Reject): NodeJS.Timeout => {
    return setTimeout((): void => {
      item ? resolve(item) : reject(en ? 'Item was not found' : 'Элемент не был найден')
    }, ms)
  })
}

export default async (): Promise<void> => {
  const preloader = document.querySelector('*[data-preloader]') as HTMLDivElement

  if (!preloader) return

  const duration: number = 500

  preloader.style.transitionDuration = `${duration}ms`
  preloader.classList.add('invisible', 'opacity-0')

  await loadTimePreloader({ item: preloader, ms: duration })
    .then((item: HTMLDivElement): void => {
      item.remove()
    })
    .catch((error: string): void => createError(error))
}
