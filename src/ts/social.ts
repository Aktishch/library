import { Container, Coordinates } from '@utils'

export default (container: Container = document): void => {
  const social = container.querySelector('*[data-social]') as HTMLDivElement

  if (!social) return

  const round = social.querySelector('*[data-social-round]') as HTMLDivElement
  const links = social.querySelectorAll('*[data-social-link]') as NodeListOf<HTMLAnchorElement>
  const btn = social.querySelector('*[data-social-button]') as HTMLButtonElement
  let lastTap: number

  const checkSocial = (): void => {
    const timeSince: number = new Date().getTime() - lastTap

    if (timeSince < 300 && timeSince > 0) round.dataset.socialRound = round.dataset.socialRound === 'show' ? '' : 'show'

    lastTap = new Date().getTime()
  }

  const setLinksPosition = (): void => {
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
        left: Math.round(width / 2 + radius * Math.cos(angle) - link.offsetWidth / 2)
      }

      link.style.top = `${coordinates.top}px`
      link.style.left = `${coordinates.left}px`
      angle += step
    })
  }

  setLinksPosition()
  window.addEventListener('resize', setLinksPosition as EventListener)
  btn.addEventListener('click', checkSocial as EventListener)
  btn.addEventListener('touchstart', checkSocial as EventListener, { passive: true })
}
