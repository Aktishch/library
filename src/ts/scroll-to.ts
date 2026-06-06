import { Container, getScrollPosition } from '@utils'

type TargetId = string | null
type Header = HTMLElement | null
type Id = string | null

interface ScrollingPosition {
  block: HTMLElement
  behavior: 'smooth' | 'auto'
}

const hash: string = window.location.hash

export const targetId: TargetId = hash ? hash.replace('#', '') : null

if (hash) {
  window.history.replaceState(null, document.title, window.location.pathname + window.location.search)
}

export default (container: Container = document): void => {
  const scrollTo = ({ block, behavior }: ScrollingPosition): void => {
    if (!block) return

    const header: Header = container.querySelector('*[data-header]')
    const offsetTop: number =
      block.getBoundingClientRect().top + getScrollPosition().top - (header ? header.offsetHeight : 0)

    window.scrollTo({ top: offsetTop, behavior })
  }

  const scrollToElement = (event: Event): void => {
    const link: HTMLAnchorElement = event.target as HTMLAnchorElement

    if (link.closest('[data-scroll-to]')) {
      event.preventDefault()

      const id: Id = link.getAttribute('href')

      if (id) {
        if (id[0] !== '#' || id === '#') return

        scrollTo({ block: container.querySelector(id) as HTMLElement, behavior: 'smooth' })
      }
    }
  }

  if (targetId) {
    scrollTo({ block: container.querySelector(`#${targetId}`) as HTMLElement, behavior: 'auto' })
  }

  container.addEventListener('click', scrollToElement as EventListener)
}
