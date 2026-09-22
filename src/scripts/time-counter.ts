import { Container, getData, isEn, logError } from '@utils'

const DATA_COUNTER = getData('counter')
const HIDDEN_CLASSNAME = 'hidden'

export default (container: Container = document) => {
  const counter: HTMLDivElement | null = container.querySelector(`*[${DATA_COUNTER}]`)

  if (!counter) return

  const subtitle: HTMLDivElement | null = counter.querySelector(`*[${DATA_COUNTER}-subtitle]`)
  const timer: HTMLDivElement | null = counter.querySelector(`*[${DATA_COUNTER}-timer]`)

  if (!subtitle || !timer) {
    logError(
      isEn
        ? `The ${DATA_COUNTER} does not have a ${DATA_COUNTER}-(subtitle, timer) child element`
        : `У ${DATA_COUNTER} отсутствует дочерний элемент ${DATA_COUNTER}-(subtitle, timer)`
    )
    return
  }

  const units = timer.querySelectorAll<HTMLSpanElement>(`*[${DATA_COUNTER}-unit]`)
  const date = new Date(
    Number(counter.dataset.year) || 0,
    (Number(counter.dataset.month) || 1) - 1,
    Number(counter.dataset.day) || 0,
    Number(counter.dataset.hour) || 0,
    Number(counter.dataset.minute) || 0,
    Number(counter.dataset.second) || 0
  ).getTime()
  let interval: NodeJS.Timeout | undefined

  const removeTimeCounter = () => {
    if (interval) {
      clearInterval(interval)
    }

    timer.remove()
    subtitle.classList.remove(HIDDEN_CLASSNAME)
  }

  const setTimeCounter = () => {
    const distance = date - new Date().getTime()

    if (distance <= 0) {
      removeTimeCounter()
      return
    }

    const day = 24 * 60 * 60 * 1000
    const hour = 60 * 60 * 1000
    const minute = 60 * 1000
    const values = [
      Math.floor(distance / day),
      Math.floor((distance % day) / hour),
      Math.floor((distance % hour) / minute),
      Math.floor((distance % minute) / 1000)
    ]

    if (units.length === values.length) {
      units.forEach((unit, index) => {
        unit.textContent = String(values[index]).padStart(2, '0')
      })
    }
  }

  setTimeCounter()

  if (date - Date.now() > 0) {
    interval = setInterval(setTimeCounter, 1000)
  }
}
