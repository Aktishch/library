import { Container, getData, isEn, logError } from '@utils'

type Canvas = HTMLCanvasElement | null
type Context = CanvasRenderingContext2D | null
type Src = string | undefined
type Link = HTMLAnchorElement | null
type Text = string | undefined

const DATA_RENDERING: string = getData('rendering')

export default (container: Container = document): void => {
  const renderings: NodeListOf<HTMLDivElement> = container.querySelectorAll(`*[${DATA_RENDERING}]`)

  if (!renderings.length) return

  renderings.forEach((rendering: HTMLDivElement): void => {
    const canvas: Canvas = rendering.querySelector(`*[${DATA_RENDERING}-canvas]`)

    if (!canvas) return

    const context: Context = canvas.getContext('2d')
    const src: Src = canvas.dataset.renderingCanvas

    if (!context || !src) {
      return logError(
        isEn
          ? 'Failed to provide a rendering context for the element'
          : 'Не удалось представить контекст рендеринга для элемента'
      )
    }

    const link: Link = rendering.querySelector(`*[${DATA_RENDERING}-link]`)
    const image: HTMLImageElement = new Image()
    const text: Text = rendering.dataset.rendering

    image.crossOrigin = 'anonymous'

    const handleImageLoad = (): void => {
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      context.drawImage(image, 0, 0)
      context.font = '24px sans-serif'
      context.fillStyle = '#000000'
      context.textAlign = 'center'
      context.textBaseline = 'middle'

      if (text) {
        context.fillText(text, canvas.width / 2, canvas.height / 1.5)
      }

      if (link) {
        link.href = canvas.toDataURL('image/png')
      }
    }

    const handleImageError = (): void => {
      logError(isEn ? "Couldn't upload image" : 'Не удалось загрузить изображение')
    }

    image.addEventListener('load', handleImageLoad as EventListener)
    image.addEventListener('error', handleImageError as EventListener)
    image.src = src
  })
}
