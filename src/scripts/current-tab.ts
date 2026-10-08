import { isEn } from '@utils'

export default (container: Document | HTMLElement = document) => {
  const title = container.querySelector('title')

  if (!title) return

  const text = title.textContent
  let timeOut: NodeJS.Timeout | undefined

  const clearTimer = () => {
    if (timeOut) {
      clearTimeout(timeOut)
    }
  }

  const onBlur = () => {
    clearTimer()

    timeOut = setTimeout(() => {
      title.innerText = isEn ? 'You have left the page' : 'Вы покинули страницу'
    }, 5000)
  }

  const onFocus = () => {
    clearTimer()
    title.innerText = text
  }

  window.addEventListener('blur', onBlur)
  window.addEventListener('focus', onFocus)
}
