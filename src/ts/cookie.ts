import { Container, COOKIE_EXPIRES_DAYS, getCookie, getData, isEn, logError, setCookies } from '@utils'

type Button = HTMLButtonElement | null

const DATA_COOKIE: string = getData('cookie')
const COOKIE_VALUE: string = 'active'

const handleIdError = (): void => {
  logError(isEn ? `The ${DATA_COOKIE} has no id` : `У ${DATA_COOKIE} отсутствует id`)
}

export default (container: Container = document): void => {
  const cookies: NodeListOf<HTMLElement> = container.querySelectorAll(`*[${DATA_COOKIE}]`)

  if (!cookies.length) return

  cookies.forEach((cookie: HTMLElement): void => {
    const id: string = cookie.id

    if (cookie.id === '') {
      handleIdError()
      return
    }

    const name: string = `cookie_${id}`

    if (getCookie(name) === COOKIE_VALUE) {
      cookie.remove()
    } else {
      const button: Button = cookie.querySelector(`*[${DATA_COOKIE}-button]`)
      const expires: number = Number(cookie.dataset.expires) || Math.floor(COOKIE_EXPIRES_DAYS / 12 / 4)
      const path: string = cookie.dataset.cookie || '/'

      const addCookie = (): void => {
        setCookies({ name, value: COOKIE_VALUE, path, expires })
        cookie.remove()
      }

      button?.addEventListener('click', addCookie as EventListener)
    }
  })
}
