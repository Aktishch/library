import { media } from '@plugins/media'
import { scrollbarHidden, scrollbarShow } from '@utils'

type SidebarResize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
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
    if ((event.target as SidebarButton).closest('[data-sidebar-open]')) {
      const open = event.target as SidebarButton
      const sidebar = document.querySelector(`#${open.dataset.sidebarOpen}`) as HTMLDivElement

      if (sidebar) openSidebar(sidebar)
    }

    if ((event.target as SidebarButton).closest('[data-sidebar-close]')) {
      const close = event.target as SidebarButton
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
      if (sidebar.hasAttribute('data-sidebar-resize')) {
        const breakpoint: number = media[sidebar.dataset.sidebarResize as SidebarResize]

        if ((document.documentElement as HTMLHtmlElement).clientWidth > breakpoint) closeSidebar(sidebar)
      }
    })
  }) as EventListener)
}
