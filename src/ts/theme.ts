import { checkCookie, html, setCookies } from '@utils'

export default (): void => {
  const toggles = document.querySelectorAll('*[data-theme-toggle]') as NodeListOf<HTMLInputElement>
  const name: string = 'current_theme'
  const hasCookie: boolean = checkCookie(`${name}=dark`)

  const checkToggles = (isChecked: boolean): void => {
    toggles.forEach((toggle: HTMLInputElement): void => {
      if (!toggle) return

      toggle.checked = isChecked
    })
  }

  const setTheme = (): void => {
    const isDark: boolean = html.dataset.theme === 'dark'
    const value: string = isDark ? '' : 'dark'

    html.dataset.theme = value
    checkToggles(!isDark)
    setCookies({ name, value, path: '/', expires: !isDark ? 31 : -1 })
  }

  if (hasCookie) {
    html.dataset.theme = 'dark'
    checkToggles(hasCookie)
  }

  toggles.forEach((toggle: HTMLInputElement): void => {
    if (!toggle) return

    toggle.addEventListener('change', setTheme as EventListener)
  })

  document.addEventListener('keyup', ((event: KeyboardEvent): void => {
    if (event.altKey && event.code === 'Digit5') {
      setTheme()
    }
  }) as EventListener)
}
