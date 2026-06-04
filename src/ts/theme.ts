import { Container, COOKIE_EXPIRES_DAYS, getCookie, html, setCookies } from '@utils'

const THEME_NAME: string = 'current_theme'
const THEME_VALUE: string = 'dark'
const THEME_COOKIE: boolean = getCookie(THEME_NAME) === THEME_VALUE

export default (container: Container = document): void => {
  const toggles: NodeListOf<HTMLInputElement> = container.querySelectorAll('*[data-theme-toggle]')
  const length: number = toggles.length

  const checkToggles = (isChecked: boolean): void => {
    if (length) {
      toggles.forEach((toggle: HTMLInputElement): void => {
        toggle.checked = isChecked
      })
    }
  }

  const setTheme = (): void => {
    const isDark: boolean = html.dataset.theme === THEME_VALUE
    const value: string = isDark ? '' : THEME_VALUE

    html.dataset.theme = value
    checkToggles(!isDark)
    setCookies({ name: THEME_NAME, value, path: '/', expires: !isDark ? COOKIE_EXPIRES_DAYS : -1 })
  }

  const onKeyUp = (event: KeyboardEvent): void => {
    if (event.altKey && event.code === 'Digit5') {
      setTheme()
    }
  }

  if (THEME_COOKIE) {
    html.dataset.theme = THEME_VALUE
    checkToggles(THEME_COOKIE)
  }

  if (length) {
    toggles.forEach((toggle: HTMLInputElement): void => {
      toggle.addEventListener('change', setTheme as EventListener)
    })
  }

  container.addEventListener('keyup', onKeyUp as EventListener)
}
