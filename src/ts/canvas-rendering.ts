import { Container, getData, isEn, logError } from '@utils'

const DATA_RENDERING: string = getData('rendering')

export default (container: Container = document): void => {
  const renderings: NodeListOf<HTMLDivElement> = container.querySelectorAll(`*[${DATA_RENDERING}]`)

  if (!renderings.length) return

  renderings.forEach((rendering: HTMLDivElement): void => {
    const canvas: HTMLCanvasElement | null = rendering.querySelector(`*[${DATA_RENDERING}-canvas]`)

    if (!canvas) return

    const context: CanvasRenderingContext2D | null = canvas.getContext('2d')
    const src: string | undefined = canvas.dataset.renderingCanvas

    if (!context || !src) return

    const download: HTMLAnchorElement | null = rendering.querySelector(`*[${DATA_RENDERING}-download]`)
    const image: HTMLImageElement = new Image()
    const text: string | undefined = rendering.dataset.rendering

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

      if (download) {
        download.href = canvas.toDataURL('image/png')
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
