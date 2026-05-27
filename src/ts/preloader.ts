import { Container, getData, hideScrollbar, isEn, logError, showScrollbar } from '@utils'

type Resolve = (value: HTMLDivElement | PromiseLike<HTMLDivElement>) => void
type Reject = (reason?: string) => void

const DATA_PRELOADER: string = getData('preloader')

const loadTimePreloader = (preloader: HTMLDivElement): Promise<HTMLDivElement> => {
  return new Promise((resolve: Resolve, reject: Reject): void => {
    if (preloader) {
      const duration: number = 500

      hideScrollbar()
      preloader.style.transitionDuration = `${duration}ms`
      preloader.classList.add('invisible', 'opacity-0')

      setTimeout((): void => {
        resolve(preloader)
      }, duration)
    } else {
      reject(isEn ? `${DATA_PRELOADER} was not found` : `${DATA_PRELOADER} не был найден`)
    }
  })
}

export default async (container: Container = document): Promise<void> => {
  await loadTimePreloader(container.querySelector(`*[${DATA_PRELOADER}]`) as HTMLDivElement)
    .then((preloader: HTMLDivElement): void => {
      showScrollbar()
      preloader.remove()
    })
    .catch((error: string): void => {
      logError(error)
    })
}
