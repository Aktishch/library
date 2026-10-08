import { getData, isEn, logError } from '@utils'

const DATA_RENDERING = getData('rendering')

const handleImageError = () => {
  logError(isEn ? `Couldn't upload image` : 'Не удалось загрузить изображение')
}

export default (container: Document | HTMLElement = document) => {
  const renderings = container.querySelectorAll<HTMLDivElement>(`*[${DATA_RENDERING}]`)

  if (!renderings.length) return

  renderings.forEach((rendering) => {
    const canvas: HTMLCanvasElement | null = rendering.querySelector(`*[${DATA_RENDERING}-canvas]`)

    if (!canvas) return

    const context = canvas.getContext('2d')
    const src = canvas.dataset.renderingCanvas

    if (!context || !src) {
      logError(
        isEn
          ? 'Failed to provide a rendering context for the element'
          : 'Не удалось представить контекст рендеринга для элемента'
      )
      return
    }

    const link: HTMLAnchorElement | null = rendering.querySelector(`*[${DATA_RENDERING}-link]`)
    const image = new Image()
    const text = rendering.dataset.rendering

    image.crossOrigin = 'anonymous'

    const handleImageLoad = () => {
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

    image.addEventListener('load', handleImageLoad)
    image.addEventListener('error', handleImageError)
    image.src = src
  })
}
