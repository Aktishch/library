import { Container } from '@utils'

export default (container: Container = document): void => {
  const items = container.querySelectorAll('*[data-number]') as NodeListOf<HTMLSpanElement>

  if (!items.length) return

  const options: IntersectionObserverInit = {
    root: container === document ? null : container,
    rootMargin: '0px',
    threshold: 0.1
  }

  const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void => {
    entries.forEach((entry: IntersectionObserverEntry): void => {
      if (entry.isIntersecting) {
        const item = entry.target as HTMLSpanElement
        const value: string | undefined = item.dataset.number

        if (!value) return

        const number: number = Number(value)
        const step: number = Number(item.dataset.step) || 0.5
        const time: number = Number(item.dataset.time) * 1000 || 1000
        const fixed: number = Number(item.dataset.fixed) || 0
        const iterations: number = number / step
        const timer: number = iterations > 0 ? Math.max(Math.round(time / iterations), 1) : 10
        let sum: number = 0

        observer.unobserve(item)

        const interval: NodeJS.Timeout = setInterval((): void => {
          sum += step

          if (sum >= number) {
            item.innerHTML = number.toFixed(fixed)
            clearInterval(interval)
          } else {
            item.innerHTML = sum.toFixed(fixed)
          }
        }, timer)
      }
    })
  }

  const observer: IntersectionObserver = new IntersectionObserver(callback, options)

  items.forEach((item: HTMLSpanElement): void => {
    observer.observe(item)
  })
}
