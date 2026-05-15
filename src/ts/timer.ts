import { Container, getTimeFormat, isSource } from '@utils'

export default (container: Container = document): void => {
  const timer = container.querySelector('*[data-timer]') as HTMLDivElement

  if (!timer) return

  const stopwatch = timer.querySelector('*[data-timer-stopwatch]') as HTMLDivElement
  const units = timer.querySelector('*[data-timer-units]') as HTMLTimeElement
  const turn = timer.querySelector('*[data-timer-turn]') as HTMLButtonElement
  const icon = turn.querySelector('use') as SVGUseElement
  const reset = timer.querySelector('*[data-timer-reset]') as HTMLButtonElement
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
    icon.setAttribute('href', `${isSource}/img/icons.svg#play`)
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
      icon.setAttribute('href', `${isSource}/img/icons.svg#play`)
    } else {
      active = true
      icon.setAttribute('href', `${isSource}/img/icons.svg#pause`)
      setTime()
    }
  }

  setDefaultState()
  turn.addEventListener('click', setActive as EventListener)
  reset.addEventListener('click', setDefaultState as EventListener)
}
