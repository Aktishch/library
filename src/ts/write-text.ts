import { Container } from '@utils'

export default (container: Container = document): void => {
  const texts = container.querySelectorAll('*[data-text]') as NodeListOf<HTMLElement>

  if (texts.length === 0) return

  const options: IntersectionObserverInit = {
    root: container === document ? null : container,
    rootMargin: '0px',
    threshold: 0.1
  }

  const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void => {
    entries.forEach((entry: IntersectionObserverEntry): void => {
      if (entry.isIntersecting) {
        const text = entry.target as HTMLElement

        if (!text.dataset.text) return

        const value: string = text.dataset.text
        const speed: number = Number(text.dataset.speed) || 100
        const letters: string[] = value.split('')

        observer.unobserve(text)

        const interval: NodeJS.Timeout = setInterval((): void => {
          if (letters.length === 0) {
            return clearInterval(interval)
          }

          text.innerHTML += letters.shift()
        }, speed)
      }
    })
  }

  const observer: IntersectionObserver = new IntersectionObserver(callback, options)

  texts.forEach((text: HTMLElement): void => {
    if (text) observer.observe(text)
  })
}
