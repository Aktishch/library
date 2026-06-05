import { Container, isEn, TimeOut } from '@utils'

type Title = HTMLTitleElement | null

export default (container: Container = document): void => {
  const title: Title = container.querySelector('title')

  if (!title) return

  const text: string = title.textContent
  let timeOut: TimeOut

  const clearTimer = (): void => {
    if (timeOut) {
      clearTimeout(timeOut)
    }
  }

  const onBlur = (): void => {
    clearTimer()

    timeOut = setTimeout((): void => {
      title.innerText = isEn ? 'You have left the page' : 'Вы покинули страницу'
    }, 5000)
  }

  const onFocus = (): void => {
    clearTimer()
    title.innerText = text
  }

  window.addEventListener('blur', onBlur as EventListener)
  window.addEventListener('focus', onFocus as EventListener)
}
