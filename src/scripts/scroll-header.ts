import { Container, getData, getScrollPosition } from '@utils'

const DATA_HEADER = getData('header')
const HEADER_CLASSNAME = 'sm:-translate-y-full'

export default (container: Container = document) => {
  const header: HTMLElement | null = container.querySelector(`*[${DATA_HEADER}]`)

  if (!header) return

  let prevOffsetTop = getScrollPosition().top

  const onScroll = () => {
    const currentOffsetTop = getScrollPosition().top

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
  container.addEventListener('scroll', onScroll, { passive: true })
}
