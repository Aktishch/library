import { getScrollPosition } from '@utils'

const className: string[] = ['sm:-translate-y-full']

export default (): void => {
  const header = document.querySelector('*[data-header]') as HTMLElement

  if (!header) return

  let prevOffsetTop: number = getScrollPosition().top

  const onScroll = (): void => {
    const currentOffsetTop: number = getScrollPosition().top

    if (header.offsetHeight < currentOffsetTop) {
      prevOffsetTop > currentOffsetTop ? header.classList.remove(...className) : header.classList.add(...className)
    }

    prevOffsetTop = currentOffsetTop
  }

  onScroll()
  document.addEventListener('scroll', onScroll as EventListener, { passive: true })
}
