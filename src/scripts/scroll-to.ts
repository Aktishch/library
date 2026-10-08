import { getData, getScrollPosition } from '@utils'

interface ScrollOptions {
  block: HTMLElement | null
  behavior: 'smooth' | 'auto'
}

const DATA_SCROLL_TO = getData('scroll-to')
const DATA_HEADER = getData('header')
const HASH = window.location.hash

export const TARGET_ID = HASH ? HASH.replace('#', '') : null

if (HASH) {
  window.history.replaceState(null, document.title, window.location.pathname + window.location.search)
}

export default (container: Document | HTMLElement = document) => {
  const scrollTo = ({ block, behavior }: ScrollOptions) => {
    if (!block) return

    const header: HTMLElement | null = container.querySelector(`*[${DATA_HEADER}]`)
    const top = block.getBoundingClientRect().top + getScrollPosition().top - (header ? header.offsetHeight : 0)

    window.scrollTo({ top, behavior })
  }

  const scrollToElement = (event: Event) => {
    const link: HTMLAnchorElement | null = (event.target as HTMLElement).closest(`[${DATA_SCROLL_TO}]`)

    if (!link) return

    event.preventDefault()

    const id = link.getAttribute('href')

    if (id) {
      if (id[0] !== '#' || id === '#') return

      scrollTo({ block: container.querySelector(id), behavior: 'smooth' })
    }
  }

  if (TARGET_ID) {
    scrollTo({ block: container.querySelector(`#${TARGET_ID}`), behavior: 'auto' })
  }

  container.addEventListener('click', scrollToElement)
}
