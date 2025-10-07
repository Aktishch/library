import { timeFormat } from './utils'

export default (): void => {
  const timer = document.querySelector('*[data-timer]') as HTMLDivElement

  if (!timer) return

  const stopwatch = timer.querySelector('*[data-timer-stopwatch]') as HTMLDivElement
  const units = timer.querySelector('*[data-timer-units]') as HTMLTimeElement
  const turn = timer.querySelector('*[data-timer-turn]') as HTMLButtonElement
  const icon = turn.querySelector('use') as SVGUseElement
  const reset = timer.querySelector('*[data-timer-reset]') as HTMLButtonElement
  let active: boolean = false
  let seconds: number = 0
  let minutes: number = 0
  let hours: number = 0
  let steps: number = 0

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

      units.innerText = `${timeFormat(hours)}:${timeFormat(minutes)}:${timeFormat(seconds)}`
      setTimeout(setTime, 1000)
    }
  }

  const statusTimer = (): void => {
    if (active) {
      active = false
      icon.setAttribute('xlink:href', '/img/icons.svg#play')
    } else {
      active = true
      icon.setAttribute('xlink:href', '/img/icons.svg#pause')
      setTime()
    }
  }

  const timerReset = (): void => {
    active = false
    seconds = 0
    minutes = 0
    hours = 0
    steps = 0
    units.innerText = '00:00:00'
    icon.setAttribute('xlink:href', '/img/icons.svg#play')
  }

  setInterval((): void => {
    stopwatch.style.transform = `rotate(${6 * steps}deg)`
  }, 1000)

  units.innerText = '00:00:00'
  turn.addEventListener('click', statusTimer as EventListener)
  reset.addEventListener('click', timerReset as EventListener)
}
