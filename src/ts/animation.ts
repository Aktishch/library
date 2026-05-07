import { Coordinates, scrolledPage } from '@utils'

const repeat: boolean = true

const setOffset = (item: HTMLElement): Coordinates => {
  return {
    top: item.getBoundingClientRect().top + scrolledPage().top,
    left: item.getBoundingClientRect().left + scrolledPage().left,
  } as Coordinates
}

export const setAnimation = (): void => {
  const items = document.querySelectorAll('*[data-anim]') as NodeListOf<HTMLElement>

  const allShow: boolean = ([...items] as HTMLElement[]).every(
    (item: HTMLElement): boolean => item.dataset.anim === 'show'
  )

  if (repeat || !allShow) {
    items.forEach((item: HTMLElement): void => {
      if (!item) return

      const height: number = item.offsetHeight
      const offsetTop: number = setOffset(item).top
      const screenPosition: number = 3
      let point: number = window.innerHeight - height / screenPosition

      if (point > window.innerHeight) point = window.innerHeight - window.innerHeight / screenPosition

      const state: boolean = scrolledPage().top > offsetTop - point && scrolledPage().top < offsetTop + height

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
