import { getScrollPosition } from '@utils'

const className: string[] = ['sm:-translate-y-full']

export default (): void => {
  const header = document.querySelector('*[data-header]') as HTMLElement

  if (!header) return

  let prevOffsetTop: number = getScrollPosition().top

  const scrollHeader = (): void => {
    const currentOffsetTop: number = getScrollPosition().top

    if (header.offsetHeight < currentOffsetTop) {
      prevOffsetTop > currentOffsetTop ? header.classList.remove(...className) : header.classList.add(...className)
    }

    prevOffsetTop = currentOffsetTop
  }

  scrollHeader()
  document.addEventListener('scroll', scrollHeader as EventListener, { passive: true })
}
