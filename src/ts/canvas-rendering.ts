import { Container, getData, isEn, logError } from '@utils'

const DATA_RENDERING: string = getData('rendering')

export default (container: Container = document): void => {
  const renderings = container.querySelectorAll(`*[${DATA_RENDERING}]`) as NodeListOf<HTMLDivElement>

  if (!renderings.length) return

  renderings.forEach((rendering: HTMLDivElement): void => {
    const canvas = rendering.querySelector(`*[${DATA_RENDERING}-canvas]`) as HTMLCanvasElement
    const download = rendering.querySelector(`*[${DATA_RENDERING}-download]`) as HTMLAnchorElement
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d')
    const src: string | undefined = canvas.dataset.renderingCanvas

    if (!context || !src) return

    const image = new Image() as HTMLImageElement

    image.crossOrigin = 'anonymous'

    const handleImageLoad = (): void => {
      const text: string | undefined = rendering.dataset.rendering

      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      context.drawImage(image, 0, 0)
      context.font = `24px sans-serif`
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
