import { Container, getScrollPosition } from '@utils'

type Header = HTMLElement | null

const HEADER_CLASSNAME: string = 'sm:-translate-y-full'

export default (container: Container = document): void => {
  const header: Header = container.querySelector('*[data-header]')

  if (!header) return

  let prevOffsetTop: number = getScrollPosition().top

  const onScroll = (): void => {
    const currentOffsetTop: number = getScrollPosition().top

    if (currentOffsetTop < 0) return

    if (header.offsetHeight < currentOffsetTop) {
      if (prevOffsetTop > currentOffsetTop) {
        header.classList.remove(HEADER_CLASSNAME)
      } else {
        header.classList.add(HEADER_CLASSNAME)
      }
    } else {
      header.classList.remove(HEADER_CLASSNAME)
    }

    prevOffsetTop = currentOffsetTop
  }

  onScroll()
  container.addEventListener('scroll', onScroll as EventListener, { passive: true })
}
