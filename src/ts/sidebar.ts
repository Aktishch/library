import { media } from '@plugins/media'
import { scrollbarHidden, scrollbarShow } from '@utils'

type SidebarBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
type SidebarButton = HTMLButtonElement | HTMLAnchorElement

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
    const toggle = event.target as SidebarButton | HTMLDivElement

    if (toggle.closest('[data-sidebar-open]') && toggle.dataset.sidebarOpen) {
      const sidebar = document.getElementById(toggle.dataset.sidebarOpen) as HTMLDivElement

      if (sidebar) openSidebar(sidebar)
    }

    if (toggle.closest('[data-sidebar-close]') && toggle.dataset.sidebarClose) {
      const sidebar = document.getElementById(toggle.dataset.sidebarClose) as HTMLDivElement

      if (sidebar) closeSidebar(sidebar)
    }

    if (toggle.hasAttribute('data-sidebar')) closeSidebar(toggle)
  }) as EventListener)

  window.addEventListener('resize', ((): void => {
    const sidebars = document.querySelectorAll('*[data-sidebar]') as NodeListOf<HTMLDivElement>

    sidebars.forEach((sidebar: HTMLDivElement): void => {
      if (sidebar && sidebar.hasAttribute('data-breakpoint')) {
        const breakpoint: number = media[sidebar.dataset.breakpoint as SidebarBreakpoint]

        if ((document.documentElement as HTMLHtmlElement).clientWidth > breakpoint) closeSidebar(sidebar)
      }
    })
  }) as EventListener)
}
