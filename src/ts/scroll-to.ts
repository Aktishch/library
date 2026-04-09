import { scrolledPage } from './utils'

export const scrollToElement = (block: HTMLElement): void => {
  if (!block) return

  const header = document.querySelector('*[data-header]') as HTMLElement
  const offsetTop: number = block.getBoundingClientRect().top + scrolledPage().top - (header ? header.offsetHeight : 0)

  window.scrollTo({
    top: offsetTop,
    behavior: 'smooth',
  })
}

export default (): void => {
  document.addEventListener('click', ((event: Event): void => {
    if ((event.target as HTMLAnchorElement).closest('[data-scroll]')) {
      event.preventDefault()

      const link = (event.target as HTMLAnchorElement).closest('[data-scroll]') as HTMLAnchorElement
      const id: string = String(link.getAttribute('href'))

      if (id[0] !== '#' || id === '#') return

      const block = document.querySelector(id) as HTMLElement

      scrollToElement(block)
    }
  }) as EventListener)
}
