const canUseWebp = (): boolean => {
  const canvas = document.createElement('canvas') as HTMLCanvasElement

  return canvas.getContext && canvas.getContext('2d')
    ? canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    : false
}

const createBackground = (data: string): void => {
  const items = document.querySelectorAll(`*[${data}]`) as NodeListOf<HTMLElement>

  items.forEach((item: HTMLElement): void => {
    if (item) item.style.backgroundImage = `url('${item.getAttribute(`${data}`)}')`
  })
}

export default (): void => {
  const firefox: RegExpMatchArray | null = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./)
  const firefoxVersion: number = firefox ? Number(firefox[1]) : 0

  createBackground('data-bg')

  if (canUseWebp() || firefoxVersion >= 65) createBackground('data-bg-webp')
}
