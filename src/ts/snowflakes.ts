import { Container, Coordinates, getTouchDevice } from '@utils'

type Snow = HTMLDivElement | null

export default (container: Container = document): void => {
  if (getTouchDevice()) return

  const snow: Snow = container.querySelector('*[data-snow]')

  if (!snow) return

  let flag: boolean = true

  const createSnowflake = (event: MouseEvent): void => {
    if (!flag) return

    const snowflake: HTMLSpanElement = document.createElement('span')
    const size: number = Math.random() * 60
    const coordinates: Coordinates = {
      top: event.clientY,
      left: event.clientX
    }

    const removeSnowflake = (): void => {
      snowflake.remove()
    }

    snowflake.classList.add('snowflake')
    snowflake.style.width = `${20 + size}px`
    snowflake.style.height = `${20 + size}px`
    snowflake.style.top = `${coordinates.top}px`
    snowflake.style.left = `${coordinates.left}px`
    snow.appendChild(snowflake)
    flag = false
    snowflake.addEventListener('animationend', removeSnowflake as EventListener, { once: true })

    setTimeout((): void => {
      flag = true
    }, 300)
  }

  container.addEventListener('mousemove', createSnowflake as EventListener)
}
