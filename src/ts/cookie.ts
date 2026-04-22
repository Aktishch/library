import { getCookies } from '@utils'

export default (): void => {
  const cookies = document.querySelectorAll('*[data-cookie]') as NodeListOf<HTMLElement>

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
        getCookies({ value, path, expires })
        cookie.remove()
      }) as EventListener)
    }
  })
}
