export default (): void => {
  const renderings = document.querySelectorAll('*[data-rendering]') as NodeListOf<HTMLDivElement>

  renderings.forEach((rendering: HTMLDivElement): void => {
    if (!rendering) return

    const canvas = rendering.querySelector('*[data-rendering-canvas]') as HTMLCanvasElement
    const download = rendering.querySelector('*[data-rendering-download]') as HTMLAnchorElement
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    const image = new Image() as HTMLImageElement

    image.addEventListener('load', ((): void => {
      context.drawImage(image, 0, 0)
      context.font = '1.5rem SF Pro Display'
      context.fillStyle = '#000'
      context.textAlign = 'center'

      if (rendering.dataset.rendering !== undefined)
        context.fillText(String(rendering.dataset.rendering), canvas.width / 2, canvas.height / 1.5)

      if (download) download.href = canvas.toDataURL()
    }) as EventListener)

    image.src = String(canvas.dataset.renderingCanvas)
  })
}
