import { Coordinates } from '@utils'

export default (): void => {
  const social = document.querySelector('*[data-social]') as HTMLDivElement

  if (!social) return

  const round = social.querySelector('*[data-social-round]') as HTMLDivElement
  const links = social.querySelectorAll('*[data-social-link]') as NodeListOf<HTMLAnchorElement>
  const btn = social.querySelector('*[data-social-button]') as HTMLButtonElement
  let lastTap: number

  const doubleTap = (): void => {
    const timeSince: number = new Date().getTime() - lastTap

    if (timeSince < 300 && timeSince > 0) round.dataset.socialRound = round.dataset.socialRound === 'show' ? '' : 'show'

    lastTap = new Date().getTime()
  }

  const getLinksPosition = (): void => {
    const radius = Number(social.dataset.social) * 100 || 100
    const width: number = social.offsetWidth
    const height: number = social.offsetHeight
    const length: number = links.length
    const step: number = (2 * Math.PI) / length
    let angle: number = 0

    links.forEach((link: HTMLAnchorElement): void => {
      if (!link) return

      const coordinates: Coordinates = {
        top: Math.round(height / 2 + radius * Math.sin(angle) - link.offsetHeight / 2),
        left: Math.round(width / 2 + radius * Math.cos(angle) - link.offsetWidth / 2),
      }

      link.style.top = `${coordinates.top}px`
      link.style.left = `${coordinates.left}px`
      angle += step
    })
  }

  getLinksPosition()
  window.addEventListener('resize', getLinksPosition as EventListener)
  btn.addEventListener('click', doubleTap as EventListener)
  btn.addEventListener('touchstart', doubleTap as EventListener, { passive: true })
}
