import { Container, createError, getEn } from '@utils'

interface BackgroundHandler {
  item: HTMLElement
  requestUrl: string
}

interface BackgroundInitialization {
  data: string
  container: Container
}

const getFormatWebp = (): boolean => {
  const canvas = document.createElement('canvas') as HTMLCanvasElement

  return canvas.getContext && canvas.getContext('2d')
    ? canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    : false
}

const handleBackground = async ({ item, requestUrl }: BackgroundHandler): Promise<void> => {
  await fetch(requestUrl)
    .then((response: Response): boolean => {
      return response.ok
    })
    .then((response: boolean): void => {
      response
        ? (item.style.backgroundImage = `url('${requestUrl}')`)
        : createError(getEn() ? 'The path to the image is incorrect' : 'Путь к изображению указан неверно')
    })
    .catch((error: string): void => createError(error))
}

const initBackground = ({ data, container }: BackgroundInitialization): void => {
  const items = container.querySelectorAll(`*[${data}]`) as NodeListOf<HTMLElement>

  items.forEach((item: HTMLElement): void => {
    if (!item) return

    const requestUrl: string | null = item.getAttribute(data)

    if (requestUrl) handleBackground({ item, requestUrl })
  })
}

export default (container: Container = document): void => {
  const firefox: RegExpMatchArray | null = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./)
  const firefoxVersion: number = firefox ? Number(firefox[1]) : 0

  initBackground({ data: 'data-bg', container })

  if (getFormatWebp() || firefoxVersion >= 65) initBackground({ data: 'data-webp', container })
}
