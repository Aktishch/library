import { Container, TimeOut } from '@utils'

type Value = string | undefined

export default (container: Container = document): void => {
  const texts: NodeListOf<HTMLElement> = container.querySelectorAll('*[data-text]')

  if (!texts.length) return

  const options: IntersectionObserverInit = {
    root: container === document ? null : container,
    rootMargin: '0px',
    threshold: 0.1
  }

  const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void => {
    entries.forEach((entry: IntersectionObserverEntry): void => {
      if (entry.isIntersecting) {
        const text: HTMLElement = entry.target as HTMLElement
        const value: Value = text.dataset.text

        if (!value) return

        const speed: number = Number(text.dataset.speed) || 100
        const letters: string[] = value.split('')

        observer.unobserve(text)

        const interval: TimeOut = setInterval((): void => {
          if (!letters.length) {
            return clearInterval(interval)
          }

          text.innerHTML += letters.shift()
        }, speed)
      }
    })
  }

  const observer: IntersectionObserver = new IntersectionObserver(callback, options)

  texts.forEach((text: HTMLElement): void => {
    observer.observe(text)
  })
}
