import { Container } from '@utils'

export default (container: Container = document): void => {
  const setOutNumbers = (): void => {
    const items = container.querySelectorAll('*[data-number]') as NodeListOf<HTMLSpanElement>

    if (items.length !== 0) {
      items.forEach((item: HTMLSpanElement): void => {
        if (!item || !item.dataset.number) return

        const number: number = Number(item.dataset.number)
        const step: number = Number(item.dataset.step) || 0.5
        const time: number = Number(item.dataset.time) * 1000 || 1000
        const fixed: number = Number(item.dataset.fixed) || 0
        const timer: number = Math.round(time / (number / step))
        let sum: number = 0

        if (window.screen.height >= item.getBoundingClientRect().top) {
          const interval = setInterval((): void => {
            sum += step

            if (sum >= number) {
              item.innerHTML = number.toFixed(fixed)
              clearInterval(interval)
            } else {
              item.innerHTML = sum.toFixed(fixed)
            }
          }, timer)

          item.removeAttribute('data-number')
        }
      })
    } else {
      container.removeEventListener('scroll', setOutNumbers as EventListener)
    }
  }

  container.addEventListener('scroll', setOutNumbers as EventListener, { passive: true })
}
