import { getData, getTouchDevice } from '@utils'

interface ButtonOptions {
  min: number
  max: number
}

const DATA_RUNNING = getData('running')

const getRandomPosition = ({ min, max }: ButtonOptions) => {
  return Math.floor(min + Math.random() * (max - min + 1))
}

export default (container: Document | HTMLElement = document) => {
  if (getTouchDevice()) return

  const running: HTMLDivElement | null = container.querySelector(`*[${DATA_RUNNING}]`)

  if (!running) return

  const button: HTMLButtonElement | null = running.querySelector(`*[${DATA_RUNNING}-button]`)

  const onEnter = () => {
    running.style.top = `${getRandomPosition({ min: 0, max: 90 })}%`
    running.style.left = `${getRandomPosition({ min: 0, max: 90 })}%`
  }

  const onDown = () => {
    alert('Агаааааа, попалась!!!!')
  }

  running.addEventListener('mouseenter', onEnter)
  button?.addEventListener('mousedown', onDown)
}
