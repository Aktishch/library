import { Coordinates, getScrollPosition } from '@utils'

const repeat: boolean = true

const getOffset = (item: HTMLElement): Coordinates => {
  return {
    top: item.getBoundingClientRect().top + getScrollPosition().top,
    left: item.getBoundingClientRect().left + getScrollPosition().left,
  } as Coordinates
}

const setAnimation = (): void => {
  const items = document.querySelectorAll('*[data-anim]') as NodeListOf<HTMLElement>

  const allShow: boolean = ([...items] as HTMLElement[]).every(
    (item: HTMLElement): boolean => item.dataset.anim === 'show'
  )

  if (repeat || !allShow) {
    items.forEach((item: HTMLElement): void => {
      if (!item) return

      const height: number = item.offsetHeight
      const offsetTop: number = getOffset(item).top
      const screenPosition: number = 3
      let point: number = window.innerHeight - height / screenPosition

      if (point > window.innerHeight) point = window.innerHeight - window.innerHeight / screenPosition

      const state: boolean = getScrollPosition().top > offsetTop - point && getScrollPosition().top < offsetTop + height

      if (state) {
        item.dataset.anim = 'show'
      } else {
        if (repeat) item.dataset.anim = ''
      }
    })
  } else {
    document.removeEventListener('scroll', setAnimation as EventListener)
  }
}

export default (): void => {
  setAnimation()
  document.addEventListener('scroll', setAnimation as EventListener, { passive: true })
}
