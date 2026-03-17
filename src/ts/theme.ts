export default (): void => {
  const html = document.documentElement as HTMLHtmlElement
  const toggles = html.querySelectorAll('*[data-theme-toggle]') as NodeListOf<HTMLInputElement>

  const togglesChecked = (check: boolean): void => {
    toggles.forEach((toggle: HTMLInputElement): void => {
      if (toggle) toggle.checked = check
    })
  }

  const variationTheme = (): void => {
    const status: boolean = html.dataset.theme === 'dark'

    html.dataset.theme = status ? 'default' : 'dark'
    togglesChecked(!status)
    localStorage.setItem('theme', html.dataset.theme)
  }

  if (localStorage.getItem('theme')) {
    const theme: string = String(localStorage.getItem('theme'))

    html.dataset.theme = theme
    togglesChecked(theme === 'dark')
  }

  toggles.forEach((toggle: HTMLInputElement): void => {
    toggle.addEventListener('change', variationTheme as EventListener)
  })

  document.addEventListener('keyup', ((event: KeyboardEvent): void => {
    if (event.altKey && event.code === 'Digit5') variationTheme()
  }) as EventListener)
}
