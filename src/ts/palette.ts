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

const PALETTE_NAME: string = 'palette'
const DATA_PALETTE: string = getData(PALETTE_NAME)
const COOKIE_VALUE: string = getCookie(PALETTE_NAME)
const PALETTE_COLORS: Record<string, string> = JSON.parse(COOKIE_VALUE || '{}')

const setError = (): void => {
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

  const palette: HTMLDivElement | null = container.querySelector(`*[${DATA_PALETTE}]`)

  if (!palette) return

  const items: NodeListOf<HTMLLIElement> = palette.querySelectorAll(`*[${DATA_PALETTE}-item]`)
  const reset: HTMLButtonElement | null = palette.querySelector(`*[${DATA_PALETTE}-reset]`)

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

    const input: HTMLInputElement | null = item.querySelector(`*[${DATA_PALETTE}-input]`)
    const button: HTMLButtonElement | null = item.querySelector(`*[${DATA_PALETTE}-button]`)

    if (!input || !button) {
      return setError()
    }

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

  reset?.addEventListener('click', ((): void => {
    if (Object.keys(PALETTE_COLORS).length !== 0) {
      items.forEach((item: HTMLLIElement): void => {
        if (!item) return

        const input: HTMLInputElement | null = item.querySelector(`*[${DATA_PALETTE}-input]`)
        const button: HTMLButtonElement | null = item.querySelector(`*[${DATA_PALETTE}-button]`)

        if (!input || !button) {
          return setError()
        }

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
