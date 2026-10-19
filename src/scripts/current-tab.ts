import { isRu } from '@utils'

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
      title.innerText = isRu ? 'Вы покинули страницу' : 'You have left the page'
    }, 5000)
  }

  const onFocus = () => {
    clearTimer()
    title.innerText = text
  }

  window.addEventListener('blur', onBlur)
  window.addEventListener('focus', onFocus)
}
