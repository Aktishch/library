import { Container, isEn, logError } from '@utils'

interface BackgroundHandler {
  item: HTMLElement
  requestUrl: string
}

const getFormatWebp = (): boolean => {
  const canvas = document.createElement('canvas') as HTMLCanvasElement

  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

const handleBackground = async ({ item, requestUrl }: BackgroundHandler): Promise<void> => {
  try {
    const response: Response = await fetch(requestUrl, { method: 'HEAD' })

    if (!response.ok) {
      throw isEn ? 'The path to the image is incorrect' : 'Путь к изображению указан неверно'
    }

    item.style.backgroundImage = `url('${requestUrl}')`
  } catch (error: unknown) {
    logError(error as string)
  }
}

export default (container: Container = document): void => {
  const items = container.querySelectorAll('*[data-bg], *[data-webp]') as NodeListOf<HTMLElement>

  if (!items.length) return

  items.forEach((item: HTMLElement): void => {
    const webpUrl: string | undefined = item.dataset.webp
    const bgUrl: string | undefined = item.dataset.bg

    if (!webpUrl || !bgUrl) return

    handleBackground({ item, requestUrl: getFormatWebp() && webpUrl ? webpUrl : bgUrl }).catch(
      (error: string): void => {
        logError(error)
      }
    )
  })
}
