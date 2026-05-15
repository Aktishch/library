import { getScrollPosition, html } from '@utils'

export default (): void => {
  const progressLine = document.querySelector('*[data-progress-line]') as HTMLDivElement

  if (!progressLine) return

  const setWidthProgress = (): void => {
    progressLine.style.width = `${Math.floor((getScrollPosition().top / (html.scrollHeight - window.innerHeight)) * 100)}%`
  }

  setWidthProgress()
  document.addEventListener('scroll', setWidthProgress as EventListener, { passive: true })
}
