import { setCookies } from '@utils'

export default (): void => {
  const html = document.documentElement as HTMLHtmlElement
  const toggles = html.querySelectorAll('*[data-theme-toggle]') as NodeListOf<HTMLInputElement>
  const value: string = 'cookie_theme_active'

  const checkToggles = (check: boolean): void => {
    toggles.forEach((toggle: HTMLInputElement): void => {
      if (toggle) toggle.checked = check
    })
  }

  const setTheme = (): void => {
    const status: boolean = html.dataset.theme === 'dark'

    html.dataset.theme = status ? '' : 'dark'
    checkToggles(!status)
    setCookies({ value, path: '/', expires: !status ? 31 : -1 })
  }

  if (document.cookie.indexOf(value) !== -1) {
    html.dataset.theme = 'dark'
    checkToggles(html.dataset.theme === 'dark')
  }

  toggles.forEach((toggle: HTMLInputElement): void => {
    toggle.addEventListener('change', setTheme as EventListener)
  })

  document.addEventListener('keyup', ((event: KeyboardEvent): void => {
    if (event.altKey && event.code === 'Digit5') setTheme()
  }) as EventListener)
}
