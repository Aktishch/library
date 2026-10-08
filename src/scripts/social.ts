import { getData, isEn, logError } from '@utils'

const DATA_SOCIAL = getData('social')
const SHOW_VALUE = 'show'

export default (container: Document | HTMLElement = document) => {
  const social: HTMLDivElement | null = container.querySelector(`*[${DATA_SOCIAL}]`)

  if (!social) return

  const round: HTMLDivElement | null = social.querySelector(`*[${DATA_SOCIAL}-round]`)
  const button: HTMLButtonElement | null = social.querySelector(`*[${DATA_SOCIAL}-button]`)

  if (!round || !button) {
    logError(
      isEn
        ? `The ${DATA_SOCIAL} does not have a ${DATA_SOCIAL}-(round, button) child element`
        : `У ${DATA_SOCIAL} отсутствует дочерний элемент ${DATA_SOCIAL}-(round, button)`
    )
    return
  }

  const links = social.querySelectorAll<HTMLAnchorElement>(`*[${DATA_SOCIAL}-link]`)
  let lastTap: number

  const checkSocial = () => {
    const timeSince = new Date().getTime() - lastTap

    if (timeSince < 300 && timeSince > 0) {
      round.dataset.socialRound = round.dataset.socialRound === SHOW_VALUE ? '' : SHOW_VALUE
    }

    lastTap = new Date().getTime()
  }

  const setLinksPosition = () => {
    const length = links.length

    if (!length) return

    const radius = Number(social.dataset.social) * 100 || 100
    const step = (2 * Math.PI) / length
    let angle = 0

    links.forEach((link) => {
      link.style.top = `${Math.round(social.offsetHeight / 2 + radius * Math.sin(angle) - link.offsetHeight / 2)}px`
      link.style.left = `${Math.round(social.offsetWidth / 2 + radius * Math.cos(angle) - link.offsetWidth / 2)}px`
      angle += step
    })
  }

  const resizeObserver = new ResizeObserver(() => {
    window.requestAnimationFrame(() => {
      setLinksPosition()
    })
  })

  setLinksPosition()
  resizeObserver.observe(social)
  button.addEventListener('click', checkSocial)
  button.addEventListener('touchstart', checkSocial, { passive: true })
}
