const visibilityPassword = (event: Event): void => {
  const password = (event.target as HTMLElement).closest('[data-password]') as HTMLButtonElement
  const label = password.closest('[data-label]') as HTMLLabelElement
  const input = label.querySelector('*[data-input="password"]') as HTMLInputElement
  const use = password.querySelector('use') as SVGUseElement
  const src: string = password.dataset.password || ''
  const status: boolean = input.type === 'password'

  input.type = status ? 'text' : 'password'
  use.setAttribute('href', status ? `${src}/img/icons.svg#eye-hidden` : `${src}/img/icons.svg#eye-visible`)
}

export default (): void => {
  document.addEventListener('click', ((event: Event): void => {
    if ((event.target as HTMLElement).closest('[data-password]')) visibilityPassword(event)
  }) as EventListener)
}
