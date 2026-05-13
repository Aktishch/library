import { getSource } from '@utils'

export default (): void => {
  document.addEventListener('click', ((event: Event): void => {
    const password = event.target as HTMLButtonElement

    if (password.closest('[data-password]')) {
      const label = password.closest('[data-label]') as HTMLLabelElement
      const input = label.querySelector('*[data-input="password"]') as HTMLInputElement
      const use = password.querySelector('use') as SVGUseElement
      const status: boolean = input.type === 'password'

      input.type = status ? 'text' : 'password'
      use.setAttribute(
        'href',
        status ? `${getSource()}/img/icons.svg#eye-hidden` : `${getSource()}/img/icons.svg#eye-visible`
      )
    }
  }) as EventListener)
}
