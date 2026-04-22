import { Coordinates } from '@utils'

type RandomPosition = {
  min: number
  max: number
}

const randomBtnPosition = ({ min, max }: RandomPosition): number => {
  return Math.floor(min + Math.random() * (max - min + 1))
}

export default (): void => {
  const running = document.querySelector('*[data-running]') as HTMLDivElement

  if (!running) return

  const button = running.querySelector('*[data-running-button]') as HTMLButtonElement

  running.addEventListener('mouseenter', ((): void => {
    const coordinates: Coordinates = {
      top: randomBtnPosition({ min: 0, max: 90 }),
      left: randomBtnPosition({ min: 0, max: 90 }),
    }

    running.style.top = `${coordinates.top}%`
    running.style.left = `${coordinates.left}%`
  }) as EventListener)

  button.addEventListener('mousedown', ((): void => {
    alert('Агаааааа, попалась!!!!')
  }) as EventListener)
}
