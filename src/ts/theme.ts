import { getCookies } from './utils'

export default (): void => {
  const html = document.documentElement as HTMLHtmlElement
  const toggles = html.querySelectorAll('*[data-theme-toggle]') as NodeListOf<HTMLInputElement>
  const value: string = 'cookie_theme_active'

  const togglesChecked = (check: boolean): void => {
    toggles.forEach((toggle: HTMLInputElement): void => {
      if (toggle) toggle.checked = check
    })
  }

  const variationTheme = (): void => {
    const status: boolean = html.dataset.theme === 'dark'

    html.dataset.theme = status ? '' : 'dark'
    togglesChecked(!status)
    getCookies({ value, path: '/', expires: !status ? 31 : -1 })
  }

  if (document.cookie.indexOf(value) !== -1) {
    html.dataset.theme = 'dark'
    togglesChecked(html.dataset.theme === 'dark')
  }

  toggles.forEach((toggle: HTMLInputElement): void => {
    toggle.addEventListener('change', variationTheme as EventListener)
  })

  document.addEventListener('keyup', ((event: KeyboardEvent): void => {
    if (event.altKey && event.code === 'Digit5') variationTheme()
  }) as EventListener)
}
