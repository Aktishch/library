import { Coordinates, getTouchDevice } from '@utils'

export default (): void => {
  if (getTouchDevice()) return

  const snow = document.querySelector('*[data-snow]') as HTMLDivElement

  if (!snow) return

  let flag: boolean = true

  const createSnowflake = (event: MouseEvent): void => {
    if (!flag) return

    const snowflake = document.createElement('span') as HTMLSpanElement
    const size: number = Math.random() * 60
    const coordinates: Coordinates = {
      top: event.clientY,
      left: event.clientX,
    }

    snowflake.classList.add('snowflake')
    snowflake.style.width = `${20 + size}px`
    snowflake.style.height = `${20 + size}px`
    snowflake.style.top = `${coordinates.top}px`
    snowflake.style.left = `${coordinates.left}px`
    snow.appendChild(snowflake)
    flag = false
    setTimeout((): void => snowflake.remove(), 3000)
    setTimeout((): void => {
      flag = true
    }, 300)
  }

  document.addEventListener('mousemove', createSnowflake as EventListener)
}
