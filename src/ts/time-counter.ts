import { Container, getData, isEn, logError, TimeOut } from '@utils'

type Counter = HTMLDivElement | null
type Subtitle = HTMLDivElement | null
type Timer = HTMLDivElement | null

const DATA_COUNTER: string = getData('counter')

const handleElementsError = (): void => {
  logError(
    isEn
      ? `The ${DATA_COUNTER} does not have a ${DATA_COUNTER}-(subtitle, timer) child element`
      : `У ${DATA_COUNTER} отсутствует дочерний элемент ${DATA_COUNTER}-(subtitle, timer)`
  )
}

export default (container: Container = document): void => {
  const counter: Counter = container.querySelector(`*[${DATA_COUNTER}]`)

  if (!counter) return

  const subtitle: Subtitle = counter.querySelector(`*[${DATA_COUNTER}-subtitle]`)
  const timer: Timer = counter.querySelector(`*[${DATA_COUNTER}-timer]`)

  if (!subtitle || !timer) {
    handleElementsError()
    return
  }

  const units: NodeListOf<HTMLSpanElement> = timer.querySelectorAll(`*[${DATA_COUNTER}-unit]`)
  const date: number = new Date(
    Number(counter.dataset.year) || 0,
    (Number(counter.dataset.month) || 1) - 1,
    Number(counter.dataset.day) || 0,
    Number(counter.dataset.hour) || 0,
    Number(counter.dataset.minute) || 0,
    Number(counter.dataset.second) || 0
  ).getTime()
  let interval: TimeOut

  const removeTimeCounter = (): void => {
    if (interval) {
      clearInterval(interval)
    }

    timer.remove()
    subtitle.classList.remove('hidden')
  }

  const setTimeCounter = (): void => {
    const distance: number = date - new Date().getTime()

    if (distance <= 0) {
      removeTimeCounter()
      return
    }

    const day: number = 24 * 60 * 60 * 1000
    const hour: number = 60 * 60 * 1000
    const minute: number = 60 * 1000
    const values: number[] = [
      Math.floor(distance / day),
      Math.floor((distance % day) / hour),
      Math.floor((distance % hour) / minute),
      Math.floor((distance % minute) / 1000)
    ]

    if (units.length === values.length) {
      units.forEach((unit: HTMLSpanElement, index: number): void => {
        unit.textContent = String(values[index]).padStart(2, '0')
      })
    }
  }

  setTimeCounter()

  if (date - Date.now() > 0) {
    interval = setInterval((): void => {
      setTimeCounter()
    }, 1000)
  }
}
