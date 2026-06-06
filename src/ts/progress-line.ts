import { Container, getScrollPosition, html } from '@utils'

type ProgressLine = HTMLDivElement | null

export default (container: Container = document): void => {
  const progressLine: ProgressLine = container.querySelector('*[data-progress-line]')

  if (!progressLine) return

  const setWidthProgress = (): void => {
    progressLine.style.width = `${Math.floor((getScrollPosition().top / (html.scrollHeight - window.innerHeight)) * 100)}%`
  }

  setWidthProgress()
  document.addEventListener('scroll', setWidthProgress as EventListener, { passive: true })
}
