import { Coordinates, scrolledPage } from '@utils'

const setOffset = (item: HTMLElement): Coordinates => {
  return {
    top: item.getBoundingClientRect().top + scrolledPage().top,
    left: item.getBoundingClientRect().left + scrolledPage().left,
  } as Coordinates
}

export const setAnimation = (): void => {
  const items = document.querySelectorAll('*[data-anim]') as NodeListOf<HTMLElement>

  items.forEach((item: HTMLElement): void => {
    if (!item) return

    const height: number = item.offsetHeight
    const offsetTop: number = setOffset(item).top
    const screenPosition: number = 4
    let point: number = window.innerHeight - height / screenPosition

    if (point > window.innerHeight) point = window.innerHeight - window.innerHeight / screenPosition

    scrolledPage().top > offsetTop - point && scrolledPage().top < offsetTop + height
      ? (item.dataset.anim = 'show')
      : (item.dataset.anim = '')
  })
}

export default (): void => {
  setAnimation()
  document.addEventListener('scroll', setAnimation as EventListener)
}
