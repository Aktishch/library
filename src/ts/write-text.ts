import { Container } from '@utils'

export default (container: Container = document): void => {
  const writeText = (): void => {
    const texts = container.querySelectorAll('*[data-text]') as NodeListOf<HTMLElement>

    if (texts.length !== 0) {
      texts.forEach((text: HTMLElement): void => {
        if (!text || !text.dataset.text) return

        const value: string = text.dataset.text
        const speed: number = Number(text.dataset.speed) || 100
        const letters: string[] = [value].join('').split('')

        if (window.screen.height >= text.getBoundingClientRect().top) {
          const interval = setInterval((): void => {
            if (!letters[0]) return clearInterval(interval)

            text.innerHTML += letters.shift()
          }, speed)

          text.removeAttribute('data-text')
        }
      })
    } else {
      container.removeEventListener('scroll', writeText as EventListener)
    }
  }

  container.addEventListener('scroll', writeText as EventListener, { passive: true })
}
