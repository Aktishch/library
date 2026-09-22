import { Container, COOKIE_EXPIRES_DAYS, getCookie, getData, html, setCookies } from '@utils'

const DATA_THEME = getData('theme')
const THEME_NAME = 'current_theme'
const THEME_VALUE = 'dark'
const THEME_COOKIE = getCookie(THEME_NAME) === THEME_VALUE

export default (container: Container = document) => {
  const toggles = container.querySelectorAll<HTMLInputElement>(`*[${DATA_THEME}-toggle]`)
  const length = toggles.length

  const checkToggles = (isChecked: boolean) => {
    if (length) {
      toggles.forEach((toggle) => {
        toggle.checked = isChecked
      })
    }
  }

  const setTheme = () => {
    const isDark = html.dataset.theme === THEME_VALUE
    const value = isDark ? '' : THEME_VALUE

    html.dataset.theme = value
    checkToggles(!isDark)
    setCookies({ name: THEME_NAME, value, path: '/', expires: !isDark ? COOKIE_EXPIRES_DAYS : -1 })
  }

  const onKeyUp = (event: KeyboardEvent) => {
    const { altKey, code } = event

    if (altKey && code === 'Digit5') {
      setTheme()
    }
  }

  if (THEME_COOKIE) {
    html.dataset.theme = THEME_VALUE
    checkToggles(THEME_COOKIE)
  }

  if (length) {
    toggles.forEach((toggle) => {
      toggle.addEventListener('change', setTheme)
    })
  }

  container.addEventListener('keyup', onKeyUp as EventListener)
}
