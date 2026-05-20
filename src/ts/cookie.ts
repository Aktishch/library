import { checkCookie, Container, setCookies } from '@utils'

const DATA_COOKIE: string = 'data-cookie'

export default (container: Container = document): void => {
  const cookies = container.querySelectorAll(`*[${DATA_COOKIE}]`) as NodeListOf<HTMLElement>

  cookies.forEach((cookie: HTMLElement): void => {
    if (!cookie || !cookie.id) return

    const id: string = cookie.id
    const name: string = `cookie_${id}`
    const hasCookie: boolean = checkCookie(`${name}=`)

    if (hasCookie) {
      cookie.remove()
    } else {
      const button = cookie.querySelector(`*[${DATA_COOKIE}-button]`) as HTMLButtonElement
      const expires: number = Number(cookie.dataset.expires) || 7
      const path: string = cookie.dataset.cookie || '/'

      button.addEventListener('click', ((): void => {
        setCookies({ name, value: 'true', path, expires })
        cookie.remove()
      }) as EventListener)
    }
  })
}
