import { media } from '@plugins'
import { hideScrollbar, html, showScrollbar } from '@utils'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
type SidebarButton = HTMLButtonElement | HTMLAnchorElement

const getSidebar = (value: string): HTMLDivElement => {
  return document.querySelector(`*[data-sidebar="${value}"]`) as HTMLDivElement
}

export const openSidebar = (sidebar: HTMLElement): void => {
  hideScrollbar()
  sidebar.setAttribute('data-open', '')
}

export const closeSidebar = (sidebar: HTMLElement): void => {
  showScrollbar()
  sidebar.removeAttribute('data-open')
}

export default (): void => {
  document.addEventListener('click', ((event: Event): void => {
    const toggle = event.target as SidebarButton | HTMLDivElement

    if (toggle.closest('[data-sidebar-open]') && toggle.dataset.sidebarOpen) {
      const sidebar = getSidebar(toggle.dataset.sidebarOpen) as HTMLDivElement

      if (sidebar) openSidebar(sidebar)
    }

    if (toggle.closest('[data-sidebar-close]') && toggle.dataset.sidebarClose) {
      const sidebar = getSidebar(toggle.dataset.sidebarClose) as HTMLDivElement

      if (sidebar) closeSidebar(sidebar)
    }

    if (toggle.hasAttribute('data-sidebar')) closeSidebar(toggle)
  }) as EventListener)

  window.addEventListener('resize', ((): void => {
    const sidebars = document.querySelectorAll('*[data-sidebar]') as NodeListOf<HTMLDivElement>

    sidebars.forEach((sidebar: HTMLDivElement): void => {
      if (sidebar && sidebar.hasAttribute('data-breakpoint')) {
        const breakpoint: number = media[sidebar.dataset.breakpoint as Breakpoint]

        if (html.clientWidth > breakpoint) closeSidebar(sidebar)
      }
    })
  }) as EventListener)
}
