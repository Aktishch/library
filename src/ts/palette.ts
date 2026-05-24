import { Container, getData, getTouchDevice, html } from '@utils'

interface Colors {
  [index: string]: {
    hex: string
    rgb: string
  }
}

const DATA_PALETTE: string = getData('palette')

export default (container: Container = document): void => {
  if (getTouchDevice()) return

  const palette = container.querySelector(`*[${DATA_PALETTE}]`) as HTMLDivElement

  if (!palette) return

  const items = palette.querySelectorAll(`*[${DATA_PALETTE}-item]`) as NodeListOf<HTMLLIElement>
  const reset = palette.querySelector(`*[${DATA_PALETTE}-reset]`) as HTMLButtonElement
  const colors: Colors = JSON.parse(localStorage.getItem('palette') || '{}')

  const getRgb = (hex: string): string => {
    hex = hex.replace(/^#/, '')

    return `${parseInt(hex.substring(0, 2), 16)}, ${parseInt(hex.substring(2, 4), 16)}, ${parseInt(hex.substring(4, 6), 16)}`
  }

  if (Object.keys(colors).length !== 0) {
    for (const key in colors) {
      html.style.setProperty(`--color-${key}`, colors[key].rgb)
    }
  }

  items.forEach((item: HTMLLIElement): void => {
    if (!item) return

    const input = item.querySelector(`*[${DATA_PALETTE}-input]`) as HTMLInputElement
    const button = item.querySelector(`*[${DATA_PALETTE}-button]`) as HTMLButtonElement
    const name: string | undefined = input.dataset.paletteInput
    const value: string | undefined = button.dataset.paletteButton

    if (!name || !value) return

    const removeColor = (): void => {
      if (colors[name]) delete colors[name]

      input.value = value
      html.style.removeProperty(`--color-${name}`)
      localStorage.setItem('palette', JSON.stringify(colors))
    }

    if (colors[name]) {
      input.value = colors[name].hex
    }

    input.addEventListener('input', ((): void => {
      const hex: string = input.value
      const rgb: string = getRgb(hex)

      colors[name] = { hex, rgb }
      html.style.setProperty(`--color-${name}`, rgb)
      localStorage.setItem('palette', JSON.stringify(colors))
    }) as EventListener)

    button.addEventListener('click', removeColor as EventListener)
    reset.addEventListener('click', removeColor as EventListener)
  })
}
