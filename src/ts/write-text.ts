import { Container } from '@utils'

export default (container: Container = document): void => {
  const writeText = (): void => {
    const records = container.querySelectorAll('*[data-record]') as NodeListOf<HTMLElement>

    if (records.length !== 0) {
      records.forEach((record: HTMLElement): void => {
        if (!record) return

        const text: string = String(record.dataset.record)
        const speed: string | undefined = record.dataset.recordSpeed
        const letters: string[] = [text].join('').split('')

        if (window.screen.height >= record.getBoundingClientRect().top) {
          const interval = setInterval(
            (): void => {
              if (!letters[0]) return clearInterval(interval)
              record.innerHTML += letters.shift()
            },
            Number(speed) | 100
          )

          record.removeAttribute('data-record')
        }
      })
    } else {
      container.removeEventListener('scroll', writeText as EventListener)
    }
  }

  container.addEventListener('scroll', writeText as EventListener, { passive: true })
}
