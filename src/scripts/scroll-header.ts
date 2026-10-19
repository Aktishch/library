import { getData, getScrollPosition } from '@utils'

const DATA_HEADER = getData('header')
const TRANSLATE_CLASSNAME = 'sm:-translate-y-full'

export default (container: Document | HTMLElement = document) => {
  const header: HTMLElement | null = container.querySelector(`*[${DATA_HEADER}]`)

  if (!header) return

  let prevOffsetTop = getScrollPosition().top

  const onScroll = () => {
    const currentOffsetTop = getScrollPosition().top

    if (currentOffsetTop < 0) return

    if (header.offsetHeight < currentOffsetTop) {
      if (prevOffsetTop > currentOffsetTop) {
        header.classList.remove(TRANSLATE_CLASSNAME)
      } else {
        header.classList.add(TRANSLATE_CLASSNAME)
      }
    } else {
      header.classList.remove(TRANSLATE_CLASSNAME)
    }

    prevOffsetTop = currentOffsetTop
  }

  onScroll()
  container.addEventListener('scroll', onScroll, { passive: true })
}
