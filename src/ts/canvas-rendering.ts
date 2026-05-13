import { Container, createError, getEn } from '@utils'

export default (container: Container = document): void => {
  const renderings = container.querySelectorAll('*[data-rendering]') as NodeListOf<HTMLDivElement>

  renderings.forEach((rendering: HTMLDivElement): void => {
    if (!rendering) return

    const canvas = rendering.querySelector('*[data-rendering-canvas]') as HTMLCanvasElement
    const download = rendering.querySelector('*[data-rendering-download]') as HTMLAnchorElement
    const image = new Image() as HTMLImageElement
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d')

    image.addEventListener('load', ((): void => {
      if (!context) return

      context.drawImage(image, 0, 0)
      context.font = '1.5rem var(--font-alt)'
      context.fillStyle = '#000'
      context.textAlign = 'center'

      if (rendering.dataset.rendering)
        context.fillText(rendering.dataset.rendering, canvas.width / 2, canvas.height / 1.5)
      if (download) download.href = canvas.toDataURL()
    }) as EventListener)

    image.addEventListener('error', ((): void => {
      createError(getEn() ? "Couldn't upload image" : 'Не удалось загрузить изображение')
    }) as EventListener)

    if (canvas.dataset.renderingCanvas) image.src = canvas.dataset.renderingCanvas
  })
}
