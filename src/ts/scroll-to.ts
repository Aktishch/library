import { getScrollPosition } from '@utils'

interface ScrollingPosition {
  block: HTMLElement
  behavior: 'smooth' | 'auto'
}

const hash: string = window.location.hash

export const targetId: string | null = hash ? hash.replace('#', '') : null

if (hash) window.history.replaceState(null, document.title, window.location.pathname + window.location.search)

const scrollTo = ({ block, behavior }: ScrollingPosition): void => {
  if (!block) return

  const header = document.querySelector('*[data-header]') as HTMLElement
  const offsetTop: number =
    block.getBoundingClientRect().top + getScrollPosition().top - (header ? header.offsetHeight : 0)

  window.scrollTo({ top: offsetTop, behavior })
}

export default (): void => {
  if (targetId) scrollTo({ block: document.querySelector(`#${targetId}`) as HTMLElement, behavior: 'auto' })

  document.addEventListener('click', ((event: Event): void => {
    const link = event.target as HTMLAnchorElement

    if (link.closest('[data-scroll-to]')) {
      event.preventDefault()

      const id: string | null = link.getAttribute('href')

      if (id) {
        if (id[0] !== '#' || id === '#') return

        scrollTo({ block: document.querySelector(id) as HTMLElement, behavior: 'smooth' })
      }
    }
  }) as EventListener)
}
