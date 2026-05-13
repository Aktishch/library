import { Container, Coordinates, getTouchDevice } from '@utils'

interface RandomPosition {
  min: number
  max: number
}

const getRandomPosition = ({ min, max }: RandomPosition): number => Math.floor(min + Math.random() * (max - min + 1))

export default (container: Container = document): void => {
  if (getTouchDevice()) return

  const running = container.querySelector('*[data-running]') as HTMLDivElement

  if (!running) return

  const button = running.querySelector('*[data-running-button]') as HTMLButtonElement

  running.addEventListener('mouseenter', ((): void => {
    const coordinates: Coordinates = {
      top: getRandomPosition({ min: 0, max: 90 }),
      left: getRandomPosition({ min: 0, max: 90 }),
    }

    running.style.top = `${coordinates.top}%`
    running.style.left = `${coordinates.left}%`
  }) as EventListener)

  button.addEventListener('mousedown', ((): void => {
    alert('Агаааааа, попалась!!!!')
  }) as EventListener)
}
