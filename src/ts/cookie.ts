import { checkCookie, Container, setCookies } from '@utils'

const DATA_COOKIE: string = 'data-cookie'

export default (container: Container = document): void => {
  const cookies = container.querySelectorAll(`*[${DATA_COOKIE}]`) as NodeListOf<HTMLElement>

  if (!cookies.length) return

  cookies.forEach((cookie: HTMLElement): void => {
    const id: string = cookie.id

    if (cookie.id === '') return

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
