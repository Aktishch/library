import { html } from '@utils/html'

interface CookieOptions {
  name: string
  value: string
  path: string
  expires: number
}

export const setCookies = ({ name, value, path, expires }: CookieOptions): void => {
  const domain: string = html.dataset.domain || window.location.hostname
  const cookieName: string = encodeURIComponent(name)
  const cookieValue: string = encodeURIComponent(value)
  const date: Date = new Date()

  date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000)
  document.cookie = `${cookieName}=${cookieValue}; path=${path}; expires=${date.toUTCString()}; domain=.${domain}; SameSite=Lax`
}

export const checkCookie = (value: string): boolean => {
  return new RegExp(`(?:^|; )${value}`).test(document.cookie)
}
