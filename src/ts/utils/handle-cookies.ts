import { html } from '@utils/html'

interface CookieOptions {
  name: string
  value: string
  path: string
  expires: number
}

const COOKIE_RED_EXP_VALUE: string = '(?:^|; )'

export const COOKIE_EXPIRES_DAYS: number = 365

export const setCookies = ({ name, value, path, expires }: CookieOptions): void => {
  const domain: string = html.dataset.domain || window.location.hostname
  const cookieName: string = encodeURIComponent(name)
  const cookieValue: string = encodeURIComponent(value)
  const date: Date = new Date()

  date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000)
  document.cookie = `${cookieName}=${cookieValue}; path=${path}; expires=${date.toUTCString()}; domain=.${domain}; SameSite=Lax`
}

export const getCookie = (name: string): string => {
  const matches: RegExpMatchArray | null = document.cookie.match(
    new RegExp(
      `${COOKIE_RED_EXP_VALUE}${encodeURIComponent(name).replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`
    )
  )

  return matches ? decodeURIComponent(matches[1]) : ''
}

export const checkCookie = (value: string): boolean => {
  return new RegExp(`${COOKIE_RED_EXP_VALUE}${value}`).test(document.cookie)
}
