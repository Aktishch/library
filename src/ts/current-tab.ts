import { en } from '@utils'

export default (): void => {
  const title = document.querySelector('title') as HTMLTitleElement

  if (!title) return

  const text: string | null = title.textContent
  let timer: NodeJS.Timeout

  if (text !== null) {
    window.addEventListener('blur', ((): void => {
      timer = setTimeout((): void => {
        title.innerText = en ? 'You have left the page' : 'Вы покинули страницу'
      }, 5000)
    }) as EventListener)

    window.addEventListener('focus', ((): void => {
      clearTimeout(timer)
      title.innerText = text
    }) as EventListener)
  }
}
