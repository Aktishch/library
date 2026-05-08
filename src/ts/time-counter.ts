import { Container } from '@utils'

export default (container: Container = document): void => {
  const counter = container.querySelector('*[data-counter]') as HTMLDivElement

  if (!counter) return

  const subtitle = counter.querySelector('*[data-counter-subtitle]') as HTMLDivElement
  const timer = counter.querySelector('*[data-counter-timer]') as HTMLDivElement
  const units = timer.querySelectorAll('*[data-counter-unit]') as NodeListOf<HTMLSpanElement>
  const date: number = new Date(
    Number(counter.dataset.year) || 0,
    Number(counter.dataset.month) - 1 || 0,
    Number(counter.dataset.day) || 0,
    Number(counter.dataset.hour) || 0,
    Number(counter.dataset.minute) || 0,
    Number(counter.dataset.second) || 0
  ).getTime()

  const getTimeCounter = (): void => {
    const distance: number = date - new Date().getTime()
    const day: number = 24 * 60 * 60 * 1000
    const hour: number = 60 * 60 * 1000
    const minute: number = 60 * 1000

    const values: number[] = [
      Math.floor(distance / day),
      Math.floor((distance % day) / hour),
      Math.floor((distance % hour) / minute),
      Math.floor((distance % minute) / 1000),
    ]

    units.forEach((unit: HTMLSpanElement, index: number): void => {
      if (unit) unit.textContent = String(values[index])
    })

    if (distance < 0) removeTimeCounter()
  }

  const interval: NodeJS.Timeout = setInterval(getTimeCounter, 1000)

  const removeTimeCounter = (): void => {
    clearInterval(interval)
    timer.remove()
    subtitle.classList.remove('hidden')
  }

  getTimeCounter()
}
