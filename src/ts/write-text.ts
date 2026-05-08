import { Container } from '@utils'

export default (container: Container = document): void => {
  const writeText = (): void => {
    const records = container.querySelectorAll('*[data-record]') as NodeListOf<HTMLElement>

    if (records.length !== 0) {
      records.forEach((record: HTMLElement): void => {
        if (!record || !record.dataset.record) return

        const text: string = record.dataset.record
        const speed: number = Number(record.dataset.speed) || 100
        const letters: string[] = [text].join('').split('')

        if (window.screen.height >= record.getBoundingClientRect().top) {
          const interval = setInterval((): void => {
            if (!letters[0]) return clearInterval(interval)

            record.innerHTML += letters.shift()
          }, speed)

          record.removeAttribute('data-record')
        }
      })
    } else {
      container.removeEventListener('scroll', writeText as EventListener)
    }
  }

  container.addEventListener('scroll', writeText as EventListener, { passive: true })
}
