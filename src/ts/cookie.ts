import { checkCookie, Container, COOKIE_EXPIRES_DAYS, getData, isEn, logError, setCookies } from '@utils'

const DATA_COOKIE: string = getData('cookie')

export default (container: Container = document): void => {
  const cookies: NodeListOf<HTMLElement> = container.querySelectorAll(`*[${DATA_COOKIE}]`)

  if (!cookies.length) return

  cookies.forEach((cookie: HTMLElement): void => {
    const id: string = cookie.id

    if (cookie.id === '') {
      return logError(isEn ? `The ${DATA_COOKIE} has no id` : `У ${DATA_COOKIE} отсутствует id`)
    }

    const name: string = `cookie_${id}`
    const hasCookie: boolean = checkCookie(`${name}=`)

    if (hasCookie) {
      cookie.remove()
    } else {
      const button: HTMLButtonElement | null = cookie.querySelector(`*[${DATA_COOKIE}-button]`)
      const expires: number = Number(cookie.dataset.expires) || Math.floor(COOKIE_EXPIRES_DAYS / 12 / 4)
      const path: string = cookie.dataset.cookie || '/'

      const addCookie = (): void => {
        setCookies({ name, value: 'true', path, expires })
        cookie.remove()
      }

      button?.addEventListener('click', addCookie as EventListener)
    }
  })
}
