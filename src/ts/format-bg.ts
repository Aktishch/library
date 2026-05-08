import { Container } from '@utils'

interface CreateBackground {
  data: string
  container: Container
}

const canUseWebp = (): boolean => {
  const canvas = document.createElement('canvas') as HTMLCanvasElement

  return canvas.getContext && canvas.getContext('2d')
    ? canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    : false
}

const createBackground = ({ data, container }: CreateBackground): void => {
  const items = container.querySelectorAll(`*[${data}]`) as NodeListOf<HTMLElement>

  items.forEach((item: HTMLElement): void => {
    if (item) item.style.backgroundImage = `url('${item.getAttribute(data)}')`
  })
}

export default (container: Container = document): void => {
  const firefox: RegExpMatchArray | null = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./)
  const firefoxVersion: number = firefox ? Number(firefox[1]) : 0

  createBackground({ data: 'data-bg', container })

  if (canUseWebp() || firefoxVersion >= 65) createBackground({ data: 'data-webp', container })
}
