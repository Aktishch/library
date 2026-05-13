export const getEn = (): boolean => {
  const html = document.documentElement as HTMLHtmlElement

  return html.hasAttribute('data-en')
}
