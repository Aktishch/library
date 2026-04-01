type GetCookies = {
  value: string
  path: string
  expires: number
}

export const getCookies = ({ value, path, expires }: GetCookies): void => {
  const html = document.documentElement as HTMLHtmlElement
  const domain: string = html.dataset.domain || window.location.hostname
  const date: string = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + expires
  ).toUTCString()

  document.cookie = `${value}=1; path=${path}; expires=${date}; domain=.${domain}`
}
