import { touchDevice } from '@utils'

type PalleteColors = {
  [index: string]: {
    hex: string
    rgb: string
  }
}

export default (): void => {
  if (touchDevice()) return

  const html = document.documentElement as HTMLHtmlElement
  const pallete = html.querySelector('*[data-pallete]') as HTMLDivElement

  if (!pallete) return

  const colors: PalleteColors = JSON.parse(localStorage.getItem('pallete') || '{}')
  const items = pallete.querySelectorAll('*[data-pallete-item]') as NodeListOf<HTMLLIElement>
  const reset = pallete.querySelector('*[data-pallete-reset]') as HTMLButtonElement

  const hexToRgb = (hex: string): string => {
    hex = hex.replace(/^#/, '')

    const r: number = parseInt(hex.substring(0, 2), 16)
    const g: number = parseInt(hex.substring(2, 4), 16)
    const b: number = parseInt(hex.substring(4, 6), 16)

    return `${r}, ${g}, ${b}`
  }

  if (Object.keys(colors).length !== 0) {
    for (const key in colors) html.style.setProperty(`--color-${key}`, colors[key].rgb)
  }

  items.forEach((item: HTMLLIElement): void => {
    if (!item) return

    const input = item.querySelector('*[data-pallete-input]') as HTMLInputElement
    const button = item.querySelector('*[data-pallete-button]') as HTMLButtonElement
    const name: string = String(input.dataset.palleteInput)
    const value: string = String(button.dataset.palleteButton)

    const colorRemove = (): void => {
      if (colors[name]) delete colors[name]

      input.value = value
      html.style.removeProperty(`--color-${name}`)
      localStorage.setItem('pallete', JSON.stringify(colors))
    }

    if (colors[name]) input.value = colors[name].hex

    input.addEventListener('input', ((): void => {
      const hex: string = input.value
      const rgb: string = hexToRgb(hex)

      colors[name] = { hex, rgb }
      html.style.setProperty(`--color-${name}`, rgb)
      localStorage.setItem('pallete', JSON.stringify(colors))
    }) as EventListener)

    button.addEventListener('click', colorRemove as EventListener)
    reset.addEventListener('click', colorRemove as EventListener)
  })
}
