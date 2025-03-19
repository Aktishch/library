import { scrolledPage } from './utils'

export default (): void => {
  const header = document.querySelector('*[data-header]') as HTMLElement

  if (!header) return

  let prevOffsetTop: number = scrolledPage().top

  const scrollHeader = (): void => {
    const currentOffsetTop: number = scrolledPage().top

    if (header.offsetHeight < currentOffsetTop) {
      prevOffsetTop > currentOffsetTop
        ? header.classList.remove('sm:-translate-y-full')
        : header.classList.add('sm:-translate-y-full')
    }

    prevOffsetTop = currentOffsetTop
  }

  scrollHeader()
  document.addEventListener('scroll', scrollHeader as EventListener)

  const smoothScroll = document.querySelector('#smooth-scroll') as HTMLDivElement

  if (smoothScroll) {
    const wrapperResize = (): void => {
      smoothScroll.style.paddingTop = `${header.offsetHeight}px`
    }

    wrapperResize()
    window.addEventListener('resize', wrapperResize as EventListener)
  }
}
