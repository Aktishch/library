import { media } from '../../plugins/media'
import { scrollbarHidden, scrollbarShow } from './utils'

export const openSidebar = (sidebar: HTMLElement): void => {
  scrollbarHidden()
  sidebar.dataset.sidebar = 'open'
}

export const closeSidebar = (sidebar: HTMLElement): void => {
  scrollbarShow()
  sidebar.dataset.sidebar = 'close'
}

export default (): void => {
  document.addEventListener('click', ((event: Event): void => {
    if ((event.target as HTMLButtonElement).closest('[data-sidebar-open]')) {
      const open = event.target as HTMLButtonElement
      const sidebar = document.querySelector(`#${open.dataset.sidebarOpen}`) as HTMLDivElement

      if (sidebar) openSidebar(sidebar)
    }

    if ((event.target as HTMLButtonElement).closest('[data-sidebar-close]')) {
      const close = event.target as HTMLButtonElement | HTMLAnchorElement
      const sidebar = document.querySelector(`#${close.dataset.sidebarClose}`) as HTMLDivElement

      if (sidebar) closeSidebar(sidebar)
    }

    if ((event.target as HTMLDivElement).hasAttribute('data-sidebar')) {
      const sidebar = event.target as HTMLDivElement

      if (sidebar) closeSidebar(sidebar)
    }
  }) as EventListener)

  window.addEventListener('resize', ((): void => {
    const sidebars = document.querySelectorAll('*[data-sidebar]') as NodeListOf<HTMLDivElement>

    sidebars.forEach((sidebar: HTMLDivElement): void => {
      if (sidebar.dataset.sidebarResize) {
        const breakpoint: number = media[sidebar.dataset.sidebarResize]

        if ((document.documentElement as HTMLHtmlElement).clientWidth > breakpoint) closeSidebar(sidebar)
      }
    })
  }) as EventListener)
}
