import { Container, setCookies } from '@utils'

export default (container: Container = document): void => {
  const cookies = container.querySelectorAll('*[data-cookie]') as NodeListOf<HTMLElement>

  cookies.forEach((cookie: HTMLElement): void => {
    if (!cookie) return

    const id: string = cookie.id
    const value: string = `cookie_${id}_active`

    if (document.cookie.indexOf(value) !== -1) {
      cookie.remove()
    } else {
      const button = cookie.querySelector('*[data-cookie-button]') as HTMLButtonElement
      const expires: number = Number(cookie.dataset.expires) || 7
      const path: string = cookie.dataset.cookie || '/'

      button.addEventListener('click', ((): void => {
        setCookies({ value, path, expires })
        cookie.remove()
      }) as EventListener)
    }
  })
}
