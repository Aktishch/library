import { Container, getData, getTimeFormat, isEn, logError, source } from '@utils'

type Timer = HTMLDivElement | null
type Stopwatch = HTMLDivElement | null
type Units = HTMLTimeElement | null
type Button = HTMLButtonElement | null
type Use = SVGUseElement | null

const DATA_TIMER: string = getData('timer')

const handleElementsError = (): void => {
  logError(
    isEn
      ? `The ${DATA_TIMER} does not have a ${DATA_TIMER}-(stopwatch, units, turn, reset) child element`
      : `У ${DATA_TIMER} отсутствует дочерний элемент ${DATA_TIMER}-(stopwatch, units, turn, reset)`
  )
}

export default (container: Container = document): void => {
  const timer: Timer = container.querySelector(`*[${DATA_TIMER}]`)

  if (!timer) return

  const stopwatch: Stopwatch = timer.querySelector(`*[${DATA_TIMER}-stopwatch]`)
  const units: Units = timer.querySelector(`*[${DATA_TIMER}-units]`)
  const turn: Button = timer.querySelector(`*[${DATA_TIMER}-turn]`)
  const reset: Button = timer.querySelector(`*[${DATA_TIMER}-reset]`)

  if (!stopwatch || !units || !turn || !reset) {
    handleElementsError()
    return
  }

  const use: Use = turn.querySelector('use')
  let active: boolean
  let seconds: number
  let minutes: number
  let hours: number
  let steps: number

  const setDefaultState = (): void => {
    active = false
    seconds = 0
    minutes = 0
    hours = 0
    steps = 0
    units.innerText = '00:00:00'
    use?.setAttribute('href', `${source}/img/icons.svg#play`)
    stopwatch.style.transform = 'rotate(0deg)'
  }

  const setTime = (): void => {
    if (active) {
      seconds += 1
      steps += 1

      if (seconds === 60) {
        minutes += 1
        seconds = 0
      }

      if (minutes === 60) {
        hours += 1
        minutes = 0
        seconds = 0
      }

      units.innerText = `${getTimeFormat(hours)}:${getTimeFormat(minutes)}:${getTimeFormat(seconds)}`
      stopwatch.style.transform = `rotate(${6 * steps}deg)`
      setTimeout(setTime, 1000)
    }
  }

  const setActive = (): void => {
    if (active) {
      active = false
      use?.setAttribute('href', `${source}/img/icons.svg#play`)
    } else {
      active = true
      use?.setAttribute('href', `${source}/img/icons.svg#pause`)
      setTime()
    }
  }

  setDefaultState()
  turn.addEventListener('click', setActive as EventListener)
  reset.addEventListener('click', setDefaultState as EventListener)
}
