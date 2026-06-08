import {
  Container,
  COOKIE_EXPIRES_DAYS,
  getCookie,
  getData,
  getTouchDevice,
  html,
  isEn,
  logError,
  setCookies
} from '@utils'

type Palette = HTMLDivElement | null
type Reset = HTMLButtonElement | null
type Input = HTMLInputElement | null
type Button = HTMLButtonElement | null
type Value = string | undefined

const PALETTE_NAME: string = 'palette'
const DATA_PALETTE: string = getData(PALETTE_NAME)
const COOKIE_VALUE: string = getCookie(PALETTE_NAME)
const PALETTE_COLORS: Record<string, string> = JSON.parse(COOKIE_VALUE || '{}')

const handleElementsError = (): void => {
  logError(
    isEn
      ? `The ${DATA_PALETTE} does not have a ${DATA_PALETTE}-(input, button) child element`
      : `У ${DATA_PALETTE} отсутствует дочерний элемент ${DATA_PALETTE}-(input, button)`
  )
}

const savePaletteCookie = (add: boolean = true): void => {
  setCookies({
    name: PALETTE_NAME,
    value: JSON.stringify(PALETTE_COLORS),
    path: '/',
    expires: add ? COOKIE_EXPIRES_DAYS : -1
  })
}

export default (container: Container = document): void => {
  if (getTouchDevice()) return

  const palette: Palette = container.querySelector(`*[${DATA_PALETTE}]`)

  if (!palette) return

  const items: NodeListOf<HTMLLIElement> = palette.querySelectorAll(`*[${DATA_PALETTE}-item]`)
  const reset: Reset = palette.querySelector(`*[${DATA_PALETTE}-reset]`)

  const getRgb = (hex: string): string => {
    hex = hex.replace(/^#/, '')

    return `${parseInt(hex.substring(0, 2), 16)}, ${parseInt(hex.substring(2, 4), 16)}, ${parseInt(hex.substring(4, 6), 16)}`
  }

  const resetPalette = (): void => {
    if (Object.keys(PALETTE_COLORS).length) {
      if (items.length) {
        items.forEach((item: HTMLLIElement): void => {
          const input: Input = item.querySelector(`*[${DATA_PALETTE}-input]`)
          const button: Button = item.querySelector(`*[${DATA_PALETTE}-button]`)

          if (!input || !button) {
            handleElementsError()
            return
          }

          const name: Value = input.dataset.paletteInput
          const value: Value = button.dataset.paletteButton

          if (!name || !value) return

          if (PALETTE_COLORS[name]) {
            delete PALETTE_COLORS[name]
          }

          input.value = value
          html.style.removeProperty(`--color-${name}`)
          savePaletteCookie(false)
        })
      }
    }
  }

  if (Object.keys(PALETTE_COLORS).length) {
    for (const key in PALETTE_COLORS) {
      html.style.setProperty(`--color-${key}`, getRgb(PALETTE_COLORS[key]))
    }
  }

  if (items.length) {
    items.forEach((item: HTMLLIElement): void => {
      const input: Input = item.querySelector(`*[${DATA_PALETTE}-input]`)
      const button: Button = item.querySelector(`*[${DATA_PALETTE}-button]`)

      if (!input || !button) {
        handleElementsError()
        return
      }

      const name: Value = input.dataset.paletteInput
      const value: Value = button.dataset.paletteButton

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
  }

  reset?.addEventListener('click', resetPalette as EventListener)
}
