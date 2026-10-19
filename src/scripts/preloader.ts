import { getData, hideScrollbar, isRu, logError, showScrollbar } from '@utils'

const DATA_PRELOADER = getData('preloader')
const VISIBLE_CLASSNAMES = ['invisible', 'opacity-0']
const DURATION = 500

const loadTimePreloader = (preloader: HTMLElement | null) => {
  return new Promise<HTMLElement>((resolve, reject) => {
    if (preloader) {
      hideScrollbar()
      preloader.style.transitionDuration = `${DURATION}ms`
      preloader.classList.add(...VISIBLE_CLASSNAMES)

      setTimeout(() => {
        resolve(preloader)
      }, DURATION)
    } else {
      reject(isRu ? `${DATA_PRELOADER} не был найден` : `${DATA_PRELOADER} was not found`)
    }
  })
}

export default async (container: Document | HTMLElement = document) => {
  await loadTimePreloader(container.querySelector(`*[${DATA_PRELOADER}]`))
    .then((preloader) => {
      showScrollbar()
      preloader.remove()
    })
    .catch((error: string) => {
      logError(error)
    })
}
