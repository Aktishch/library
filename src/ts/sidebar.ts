import { media } from '@plugins'
import { Breakpoint, Container, getData, hideScrollbar, html, isEn, logError, showScrollbar } from '@utils'

type Sidebar = HTMLDivElement | null
type Button = HTMLButtonElement | HTMLAnchorElement | null
type Value = string | undefined

const DATA_SIDEBAR: string = getData('sidebar')
const DATA_OPEN: string = getData('open')

const handleValueError = (value: string): void => {
  logError(isEn ? `${DATA_SIDEBAR}-${value} is missing a value` : `У ${DATA_SIDEBAR}-${value} отсутствует значение`)
}

export const openSidebar = (sidebar: HTMLElement): void => {
  hideScrollbar()
  sidebar.setAttribute(DATA_OPEN, '')
}

export const closeSidebar = (sidebar: HTMLElement): void => {
  showScrollbar()
  sidebar.removeAttribute(DATA_OPEN)
}

const resizeObserver: ResizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]): void => {
  if (!entries.length) return

  entries.forEach((entry: ResizeObserverEntry): void => {
    const sidebar: HTMLElement = entry.target as HTMLElement
    const value: Breakpoint | Value = sidebar.dataset.breakpoint

    if (!value) return

    const breakpoint: number = media[value]

    window.requestAnimationFrame((): void => {
      if (html.clientWidth > breakpoint) {
        closeSidebar(sidebar)
      }
    })
  })
})

export default (container: Container = document): void => {
  const sidebars: NodeListOf<HTMLDivElement> = container.querySelectorAll(`*[${DATA_SIDEBAR}]`)

  if (!sidebars.length) return

  const getSidebar = (value: string): Sidebar => {
    return container.querySelector(`*[${DATA_SIDEBAR}="${value}"]`)
  }

  const changeSidebar = (event: Event): void => {
    const toggle: HTMLElement = event.target as HTMLElement
    const open: Button = toggle.closest(`[${DATA_SIDEBAR}-open]`)
    const close: Button = toggle.closest(`[${DATA_SIDEBAR}-close]`)

    if (open) {
      const value: Value = open.dataset.sidebarOpen

      if (!value) {
        handleValueError('open')
        return
      }

      const sidebar: Sidebar = getSidebar(value)

      if (sidebar) {
        openSidebar(sidebar)
      }

      return
    }

    if (close) {
      const value: Value = close.dataset.sidebarClose

      if (!value) {
        handleValueError('close')
        return
      }

      const sidebar: Sidebar = getSidebar(value)

      if (sidebar) {
        closeSidebar(sidebar)
      }

      return
    }

    if (toggle.hasAttribute(`${DATA_SIDEBAR}`)) {
      closeSidebar(toggle)
    }
  }

  sidebars.forEach((sidebar: HTMLDivElement): void => {
    resizeObserver.observe(sidebar)
  })

  container.addEventListener('click', changeSidebar as EventListener)
}
