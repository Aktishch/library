import { Container, createError, isEn } from '@utils'

interface HandleBackground {
  item: HTMLElement
  requestUrl: string
}

interface CreateBackground {
  data: string
  container: Container
}

const getWebp = (): boolean => {
  const canvas = document.createElement('canvas') as HTMLCanvasElement

  return canvas.getContext && canvas.getContext('2d')
    ? canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    : false
}

const handleBackground = async ({ item, requestUrl }: HandleBackground): Promise<void> => {
  await fetch(requestUrl)
    .then((response: Response): boolean => {
      return response.ok
    })
    .then((response: boolean): void => {
      response
        ? (item.style.backgroundImage = `url('${requestUrl}')`)
        : createError(isEn ? 'The path to the image is incorrect' : 'Путь к изображению указан неверно')
    })
    .catch((error: string): void => createError(error))
}

const createBackground = ({ data, container }: CreateBackground): void => {
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

  createBackground({ data: 'data-bg', container })

  if (getWebp() || firefoxVersion >= 65) createBackground({ data: 'data-webp', container })
}
