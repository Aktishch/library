import { createError, hideScrollbar, isEn, showScrollbar } from '@utils'

type Resolve = (value: HTMLDivElement | PromiseLike<HTMLDivElement>) => void
type Reject = (reason?: string) => void

const loadTimePreloader = (preloader: HTMLDivElement): Promise<HTMLDivElement> => {
  return new Promise((resolve: Resolve, reject: Reject): void => {
    if (preloader) {
      hideScrollbar()

      const duration: number = 500

      preloader.style.transitionDuration = `${duration}ms`
      preloader.classList.add('invisible', 'opacity-0')

      setTimeout((): void => resolve(preloader), duration)
    } else {
      reject(isEn ? 'Preloader was not found' : 'Прелоадер не был найден')
    }
  })
}

export default async (): Promise<void> => {
  await loadTimePreloader(document.querySelector('*[data-preloader]') as HTMLDivElement)
    .then((preloader: HTMLDivElement): void => {
      showScrollbar()
      preloader.remove()
    })
    .catch((error: string): void => createError(error))
}
