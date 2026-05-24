import { Container, isEn } from '@utils'

export default (container: Container = document): void => {
  const title = container.querySelector('title') as HTMLTitleElement

  if (!title) return

  const text: string = title.textContent
  let timeOut: NodeJS.Timeout

  const clearTimer = (): void => {
    if (timeOut) {
      clearTimeout(timeOut)
    }
  }

  window.addEventListener('blur', ((): void => {
    clearTimer()

    timeOut = setTimeout((): void => {
      title.innerText = isEn ? 'You have left the page' : 'Вы покинули страницу'
    }, 5000)
  }) as EventListener)

  window.addEventListener('focus', ((): void => {
    clearTimer()
    title.innerText = text
  }) as EventListener)
}
