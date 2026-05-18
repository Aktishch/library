import { Container } from '@utils'

export default (container: Container = document): void => {
  const items = container.querySelectorAll('*[data-anim]') as NodeListOf<HTMLElement>

  if (items.length === 0) return

  const repeat: boolean = true
  const options: IntersectionObserverInit = {
    root: container === document ? null : container,
    rootMargin: '0px 0px -20% 0px',
    threshold: 0
  }

  const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void => {
    entries.forEach((entry: IntersectionObserverEntry): void => {
      const item = entry.target as HTMLElement

      if (entry.isIntersecting) {
        item.dataset.anim = 'show'

        if (!repeat) observer.unobserve(item)
      } else {
        if (repeat) item.dataset.anim = ''
      }
    })

    if (!repeat) {
      const allShow: boolean = ([...items] as HTMLElement[]).every(
        (item: HTMLElement): boolean => item.dataset.anim === 'show'
      )

      if (allShow) observer.disconnect()
    }
  }

  const observer: IntersectionObserver = new IntersectionObserver(callback, options)

  items.forEach((item: HTMLElement): void => {
    if (item) observer.observe(item)
  })
}
