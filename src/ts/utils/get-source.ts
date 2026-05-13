export const getSource = (): string => {
  const html = document.documentElement as HTMLHtmlElement

  return html.dataset.source || ''
}
