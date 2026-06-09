import { Container, Coordinates, getData, isEn, logError } from '@utils'

type Social = HTMLDivElement | null
type Round = HTMLDivElement | null
type Button = HTMLButtonElement | null

const DATA_SOCIAL: string = getData('social')
const SHOW_VALUE: string = 'show'

const handleElementsError = (): void => {
  logError(
    isEn
      ? `The ${DATA_SOCIAL} does not have a ${DATA_SOCIAL}-(round, button) child element`
      : `У ${DATA_SOCIAL} отсутствует дочерний элемент ${DATA_SOCIAL}-(round, button)`
  )
}

export default (container: Container = document): void => {
  const social: Social = container.querySelector(`*[${DATA_SOCIAL}]`)

  if (!social) return

  const round: Round = social.querySelector(`*[${DATA_SOCIAL}-round]`)
  const button: Button = social.querySelector(`*[${DATA_SOCIAL}-button]`)

  if (!round || !button) {
    handleElementsError()
    return
  }

  const links: NodeListOf<HTMLAnchorElement> = social.querySelectorAll(`*[${DATA_SOCIAL}-link]`)
  let lastTap: number

  const checkSocial = (): void => {
    const timeSince: number = new Date().getTime() - lastTap

    if (timeSince < 300 && timeSince > 0) {
      round.dataset.socialRound = round.dataset.socialRound === SHOW_VALUE ? '' : SHOW_VALUE
    }

    lastTap = new Date().getTime()
  }

  const setLinksPosition = (): void => {
    if (!links.length) return

    const radius = Number(social.dataset.social) * 100 || 100
    const width: number = social.offsetWidth
    const height: number = social.offsetHeight
    const length: number = links.length
    const step: number = (2 * Math.PI) / length
    let angle: number = 0

    links.forEach((link: HTMLAnchorElement): void => {
      const coordinates: Coordinates = {
        top: Math.round(height / 2 + radius * Math.sin(angle) - link.offsetHeight / 2),
        left: Math.round(width / 2 + radius * Math.cos(angle) - link.offsetWidth / 2)
      }

      link.style.top = `${coordinates.top}px`
      link.style.left = `${coordinates.left}px`
      angle += step
    })
  }

  const resizeObserver: ResizeObserver = new ResizeObserver((): void => {
    window.requestAnimationFrame((): void => {
      setLinksPosition()
    })
  })

  setLinksPosition()
  resizeObserver.observe(social)
  button.addEventListener('click', checkSocial as EventListener)
  button.addEventListener('touchstart', checkSocial as EventListener, { passive: true })
}
