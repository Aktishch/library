import { COOKIE_EXPIRES_DAYS, getCookie, getData, getTouchDevice, html, isEn, logError, setCookies } from '@utils'

const PALETTE_NAME = 'palette'
const DATA_PALETTE = getData(PALETTE_NAME)
const COOKIE_VALUE = getCookie(PALETTE_NAME)
const PALETTE_COLORS: Record<string, string> = JSON.parse(COOKIE_VALUE || '{}')

const handleElementsError = () => {
  logError(
    isEn
      ? `The ${DATA_PALETTE} does not have a ${DATA_PALETTE}-(input, button) child element`
      : `У ${DATA_PALETTE} отсутствует дочерний элемент ${DATA_PALETTE}-(input, button)`
  )
}

const savePaletteCookie = (add = true) => {
  setCookies({
    name: PALETTE_NAME,
    value: JSON.stringify(PALETTE_COLORS),
    path: '/',
    expires: add ? COOKIE_EXPIRES_DAYS : -1
  })
}

export default (container: Document | HTMLElement = document) => {
  if (getTouchDevice()) return

  const palette: HTMLDivElement | null = container.querySelector(`*[${DATA_PALETTE}]`)

  if (!palette) return

  const items = palette.querySelectorAll<HTMLLIElement>(`*[${DATA_PALETTE}-item]`)
  const reset: HTMLInputElement | null = palette.querySelector(`*[${DATA_PALETTE}-reset]`)

  const resetPalette = () => {
    if (Object.keys(PALETTE_COLORS).length) {
      if (items.length) {
        items.forEach((item) => {
          const input: HTMLInputElement | null = item.querySelector(`*[${DATA_PALETTE}-input]`)
          const button: HTMLInputElement | null = item.querySelector(`*[${DATA_PALETTE}-button]`)

          if (!input || !button) {
            handleElementsError()
            return
          }

          const name = input.dataset.paletteInput
          const value = button.dataset.paletteButton

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
      html.style.setProperty(`--color-${key}`, PALETTE_COLORS[key])
    }
  }

  if (items.length) {
    items.forEach((item) => {
      const input: HTMLInputElement | null = item.querySelector(`*[${DATA_PALETTE}-input]`)
      const button: HTMLInputElement | null = item.querySelector(`*[${DATA_PALETTE}-button]`)

      if (!input || !button) {
        handleElementsError()
        return
      }

      const name = input.dataset.paletteInput
      const value = button.dataset.paletteButton

      if (!name || !value) return

      const addColor = () => {
        const hex = input.value

        PALETTE_COLORS[name] = hex
        html.style.setProperty(`--color-${name}`, hex)
        savePaletteCookie()
      }

      const removeColor = () => {
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

      input.addEventListener('input', addColor)
      button.addEventListener('click', removeColor)
    })
  }

  reset?.addEventListener('click', resetPalette)
}
