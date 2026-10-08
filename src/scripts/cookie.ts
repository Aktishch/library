import { COOKIE_EXPIRES_DAYS, getCookie, getData, isEn, logError, setCookies } from '@utils'

const DATA_COOKIE = getData('cookie')
const COOKIE_VALUE = 'active'

export default (container: Document | HTMLElement = document) => {
  const cookies = container.querySelectorAll<HTMLElement>(`*[${DATA_COOKIE}]`)

  if (!cookies.length) return

  cookies.forEach((cookie) => {
    const id = cookie.id

    if (cookie.id === '') {
      logError(isEn ? `The ${DATA_COOKIE} has no id` : `У ${DATA_COOKIE} отсутствует id`)
      return
    }

    const name = `cookie_${id}`

    if (getCookie(name) === COOKIE_VALUE) {
      cookie.remove()
    } else {
      const button: HTMLButtonElement | null = cookie.querySelector(`*[${DATA_COOKIE}-button]`)
      const expires = Number(cookie.dataset.expires) || Math.floor(COOKIE_EXPIRES_DAYS / 12 / 4)
      const path = cookie.dataset.cookie || '/'

      const addCookie = () => {
        setCookies({ name, value: COOKIE_VALUE, path, expires })
        cookie.remove()
      }

      button?.addEventListener('click', addCookie)
    }
  })
}
