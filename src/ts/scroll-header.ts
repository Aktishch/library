import { scrolledPage } from '@utils'

const className: string[] = ['sm:-translate-y-full']

export default (): void => {
  const header = document.querySelector('*[data-header]') as HTMLElement

  if (!header) return

  let prevOffsetTop: number = scrolledPage().top

  const scrollHeader = (): void => {
    const currentOffsetTop: number = scrolledPage().top

    if (header.offsetHeight < currentOffsetTop) {
      prevOffsetTop > currentOffsetTop ? header.classList.remove(...className) : header.classList.add(...className)
    }

    prevOffsetTop = currentOffsetTop
  }

  scrollHeader()
  document.addEventListener('scroll', scrollHeader as EventListener, { passive: true })

  const smoothScroll = document.getElementById('smooth-scroll') as HTMLDivElement

  if (smoothScroll) {
    const wrapperResize = (): void => {
      smoothScroll.style.paddingTop = `${header.offsetHeight}px`
    }

    wrapperResize()
    window.addEventListener('resize', wrapperResize as EventListener)
  }
}
