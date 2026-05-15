import { Coordinates, getScrollPosition } from '@utils'

const repeat: boolean = true

const getOffset = (item: HTMLElement): Coordinates => {
  return {
    top: item.getBoundingClientRect().top + getScrollPosition().top,
    left: item.getBoundingClientRect().left + getScrollPosition().left,
  } as Coordinates
}

const initAnimation = (): void => {
  const items = document.querySelectorAll('*[data-anim]') as NodeListOf<HTMLElement>

  const allShow: boolean = ([...items] as HTMLElement[]).every(
    (item: HTMLElement): boolean => item.dataset.anim === 'show'
  )

  if (repeat || !allShow) {
    items.forEach((item: HTMLElement): void => {
      if (!item) return

      const height: number = item.offsetHeight
      const offsetTop: number = getOffset(item).top
      const innerHeight: number = window.innerHeight
      const screenPosition: number = 3
      let point: number = innerHeight - height / screenPosition

      if (point > innerHeight) point = innerHeight - innerHeight / screenPosition

      const state: boolean = getScrollPosition().top > offsetTop - point && getScrollPosition().top < offsetTop + height

      if (state) {
        item.dataset.anim = 'show'
      } else {
        if (repeat) item.dataset.anim = ''
      }
    })
  } else {
    document.removeEventListener('scroll', initAnimation as EventListener)
  }
}

export default (): void => {
  initAnimation()
  document.addEventListener('scroll', initAnimation as EventListener, { passive: true })
}
