import { Container, getData, isEn, logError } from '@utils'

type Show = HTMLButtonElement | null

const DATA_LISTING: string = getData('listing')
const ITEM_HIDDEN_CLASSNAME: string = 'hidden'

const handleShowError = (): void => {
  logError(
    isEn
      ? `The ${DATA_LISTING} does not have a ${DATA_LISTING}-show child element`
      : `У ${DATA_LISTING} отсутствует дочерний элемент ${DATA_LISTING}-show`
  )
}

export default (container: Container = document): void => {
  const listings: NodeListOf<HTMLElement> = container.querySelectorAll(`*[${DATA_LISTING}]`)

  if (!listings.length) return

  listings.forEach((listing: HTMLElement): void => {
    const show: Show = listing.querySelector(`*[${DATA_LISTING}-show]`)

    if (!show) {
      return handleShowError()
    }

    const items: NodeListOf<HTMLDivElement> = listing.querySelectorAll(`*[${DATA_LISTING}-item]`)

    const showItems = (): void => {
      const items: NodeListOf<HTMLDivElement> = listing.querySelectorAll(`*[${DATA_LISTING}-item]`)
      const count: number = Number(listing.dataset.listing) || items.length

      for (let i: number = 0; i < count; i++) {
        const item: HTMLDivElement = items[i]

        if (item) {
          if (item.hasAttribute('data-anim')) {
            item.dataset.anim = 'show'
          }

          item.removeAttribute(`${DATA_LISTING}-item`)
          item.classList.remove(ITEM_HIDDEN_CLASSNAME)
        }

        if (!item || items.length === count) {
          show.remove()
        }
      }
    }

    if (items.length) {
      items.forEach((item: HTMLDivElement): void => {
        item.classList.add(ITEM_HIDDEN_CLASSNAME)
      })
    }

    show.addEventListener('click', showItems as EventListener)
  })
}
