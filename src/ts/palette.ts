import { Container, COOKIE_EXPIRES_DAYS, getCookie, getData, getTouchDevice, html, setCookies } from '@utils'

interface Colors {
  [index: string]: string
}

const COOKIE_VALUE: string = getCookie('palette')
const DATA_PALETTE: string = getData('palette')
const PALETTE_COLORS: Colors = JSON.parse(COOKIE_VALUE || '{}')

const savePaletteCookie = (add: boolean = true): void => {
  setCookies({
    name: 'palette',
    value: JSON.stringify(PALETTE_COLORS),
    path: '/',
    expires: add ? COOKIE_EXPIRES_DAYS : -1
  })
}

export default (container: Container = document): void => {
  if (getTouchDevice()) return

  const palette = container.querySelector(`*[${DATA_PALETTE}]`) as HTMLDivElement

  if (!palette) return

  const items = palette.querySelectorAll(`*[${DATA_PALETTE}-item]`) as NodeListOf<HTMLLIElement>
  const reset = palette.querySelector(`*[${DATA_PALETTE}-reset]`) as HTMLButtonElement

  const getRgb = (hex: string): string => {
    hex = hex.replace(/^#/, '')

    return `${parseInt(hex.substring(0, 2), 16)}, ${parseInt(hex.substring(2, 4), 16)}, ${parseInt(hex.substring(4, 6), 16)}`
  }

  if (Object.keys(PALETTE_COLORS).length !== 0) {
    for (const key in PALETTE_COLORS) {
      html.style.setProperty(`--color-${key}`, getRgb(PALETTE_COLORS[key]))
    }
  }

  items.forEach((item: HTMLLIElement): void => {
    if (!item) return

    const input = item.querySelector(`*[${DATA_PALETTE}-input]`) as HTMLInputElement
    const button = item.querySelector(`*[${DATA_PALETTE}-button]`) as HTMLButtonElement
    const name: string | undefined = input.dataset.paletteInput
    const value: string | undefined = button.dataset.paletteButton

    if (!name || !value) return

    const addColor = (): void => {
      const hex: string = input.value

      PALETTE_COLORS[name] = hex
      html.style.setProperty(`--color-${name}`, getRgb(hex))
      savePaletteCookie()
    }

    const removeColor = (): void => {
      if (PALETTE_COLORS[name]) {
        delete PALETTE_COLORS[name]
      }

      input.value = value
      html.style.removeProperty(`--color-${name}`)
      savePaletteCookie()
    }

    if (PALETTE_COLORS[name]) {
      input.value = PALETTE_COLORS[name]
    }

    input.addEventListener('input', addColor as EventListener)
    button.addEventListener('click', removeColor as EventListener)
  })

  reset.addEventListener('click', ((): void => {
    if (Object.keys(PALETTE_COLORS).length !== 0) {
      items.forEach((item: HTMLLIElement): void => {
        if (!item) return

        const input = item.querySelector(`*[${DATA_PALETTE}-input]`) as HTMLInputElement
        const button = item.querySelector(`*[${DATA_PALETTE}-button]`) as HTMLButtonElement
        const name: string | undefined = input.dataset.paletteInput
        const value: string | undefined = button.dataset.paletteButton

        if (!name || !value) return

        if (PALETTE_COLORS[name]) {
          delete PALETTE_COLORS[name]
        }

        input.value = value
        html.style.removeProperty(`--color-${name}`)
        savePaletteCookie(false)
      })
    }
  }) as EventListener)
}
