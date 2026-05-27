import { Container, getData, isEn, logError } from '@utils'

const DATA_LISTING: string = getData('listing')
const ITEM_HIDDEN_CLASSNAME: string = 'hidden'

export default (container: Container = document): void => {
  const listings: NodeListOf<HTMLElement> = container.querySelectorAll(`*[${DATA_LISTING}]`)

  if (!listings.length) return

  listings.forEach((listing: HTMLElement): void => {
    const show: HTMLButtonElement | null = listing.querySelector(`*[${DATA_LISTING}-show]`)
    const items: NodeListOf<HTMLDivElement> = listing.querySelectorAll(`*[${DATA_LISTING}-item]`)

    items.forEach((item: HTMLDivElement): void => {
      if (!item) return

      item.classList.add(ITEM_HIDDEN_CLASSNAME)
    })

    if (show) {
      show.addEventListener('click', ((): void => {
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
      }) as EventListener)
    } else {
      logError(
        isEn
          ? `The ${DATA_LISTING} does not have a ${DATA_LISTING}-show child element`
          : `У ${DATA_LISTING} отсутствует дочерний элемент ${DATA_LISTING}-show`
      )
    }
  })
}
