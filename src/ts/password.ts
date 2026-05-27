import { Container, source } from '@utils'

export default (container: Container = document): void => {
  container.addEventListener('click', ((event: Event): void => {
    const password: HTMLButtonElement | null = (event.target as HTMLElement).closest('[data-password]')

    if (!password) return

    const label: HTMLLabelElement | null = password.closest('[data-label]')

    if (!label) return

    const input: HTMLInputElement | null = label.querySelector('*[data-input="password"]')
    const use: SVGUseElement | null = password.querySelector('use')

    if (!input || !use) return

    const status: boolean = input.type === 'password'

    input.type = status ? 'text' : 'password'
    use.setAttribute('href', status ? `${source}/img/icons.svg#eye-hidden` : `${source}/img/icons.svg#eye-visible`)
  }) as EventListener)
}
