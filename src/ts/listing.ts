import { Container, getData } from '@utils'

const DATA_LISTING: string = getData('listing')
const ITEM_HIDDEN_CLASSNAME: string = 'hidden'

export default (container: Container = document): void => {
  const listings = container.querySelectorAll(`*[${DATA_LISTING}]`) as NodeListOf<HTMLElement>

  if (!listings.length) return

  listings.forEach((listing: HTMLElement): void => {
    const show = listing.querySelector(`*[${DATA_LISTING}-show]`) as HTMLButtonElement
    const items = listing.querySelectorAll(`*[${DATA_LISTING}-item]`) as NodeListOf<HTMLDivElement>

    items.forEach((item: HTMLDivElement): void => {
      if (!item) return

      item.classList.add(ITEM_HIDDEN_CLASSNAME)
    })

    show.addEventListener('click', ((): void => {
      const items = listing.querySelectorAll(`*[${DATA_LISTING}-item]`) as NodeListOf<HTMLDivElement>
      const count: number = Number(listing.dataset.listing) || items.length

      for (let i: number = 0; i < count; i++) {
        const item = items[i] as HTMLDivElement

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
  })
}
