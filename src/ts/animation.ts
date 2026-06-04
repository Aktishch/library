import { Container } from '@utils'

const REPEAT_ANIMATION: boolean = true
const SHOW_VALUE: string = 'show'

export default (container: Container = document): void => {
  const items: NodeListOf<HTMLElement> = container.querySelectorAll('*[data-anim]')

  if (!items.length) return

  const options: IntersectionObserverInit = {
    root: container === document ? null : container,
    rootMargin: '0px',
    threshold: 0
  }

  const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void => {
    entries.forEach((entry: IntersectionObserverEntry): void => {
      const item: HTMLElement = entry.target as HTMLElement

      if (entry.isIntersecting) {
        item.dataset.anim = SHOW_VALUE

        if (!REPEAT_ANIMATION) {
          observer.unobserve(item)
        }
      } else {
        if (REPEAT_ANIMATION) {
          item.dataset.anim = ''
        }
      }
    })

    if (!REPEAT_ANIMATION) {
      const allShow: boolean = ([...items] as HTMLElement[]).every((item: HTMLElement): boolean => {
        return item.dataset.anim === SHOW_VALUE
      })

      if (allShow) {
        observer.disconnect()
      }
    }
  }

  const observer: IntersectionObserver = new IntersectionObserver(callback, options)

  items.forEach((item: HTMLElement): void => {
    observer.observe(item)
  })
}
