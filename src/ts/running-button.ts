import { Container, Coordinates, getData, getTouchDevice } from '@utils'

type Running = HTMLDivElement | null
type Button = HTMLButtonElement | null

interface RandomPosition {
  min: number
  max: number
}

const DATA_RUNNING: string = getData('running')

const getRandomPosition = ({ min, max }: RandomPosition): number => {
  return Math.floor(min + Math.random() * (max - min + 1))
}

export default (container: Container = document): void => {
  if (getTouchDevice()) return

  const running: Running = container.querySelector(`*[${DATA_RUNNING}]`)

  if (!running) return

  const button: Button = running.querySelector(`*[${DATA_RUNNING}-button]`)

  const onEnter = (): void => {
    const coordinates: Coordinates = {
      top: getRandomPosition({ min: 0, max: 90 }),
      left: getRandomPosition({ min: 0, max: 90 })
    }

    running.style.top = `${coordinates.top}%`
    running.style.left = `${coordinates.left}%`
  }

  const onDown = (): void => {
    alert('Агаааааа, попалась!!!!')
  }

  running.addEventListener('mouseenter', onEnter as EventListener)
  button?.addEventListener('mousedown', onDown as EventListener)
}
