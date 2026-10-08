import { getData, isEn, logError } from '@utils'

const DATA_LISTING = getData('listing')
const DATA_ANIM = getData('anim')
const ITEM_HIDDEN_CLASSNAME = 'hidden'

export default (container: Document | HTMLElement = document) => {
  const listings = container.querySelectorAll<HTMLElement>(`*[${DATA_LISTING}]`)

  if (!listings.length) return

  listings.forEach((listing) => {
    const show: HTMLButtonElement | null = listing.querySelector(`*[${DATA_LISTING}-show]`)

    if (!show) {
      logError(
        isEn
          ? `The ${DATA_LISTING} does not have a ${DATA_LISTING}-show child element`
          : `У ${DATA_LISTING} отсутствует дочерний элемент ${DATA_LISTING}-show`
      )
      return
    }

    const items = listing.querySelectorAll<HTMLDivElement>(`*[${DATA_LISTING}-item]`)

    const showItems = () => {
      const items = listing.querySelectorAll<HTMLDivElement>(`*[${DATA_LISTING}-item]`)
      const count = Number(listing.dataset.listing) || items.length

      for (let i = 0; i < count; i++) {
        const item = items[i]

        if (item) {
          if (item.hasAttribute(DATA_ANIM)) {
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
      items.forEach((item) => {
        item.classList.add(ITEM_HIDDEN_CLASSNAME)
      })
    }

    show.addEventListener('click', showItems)
  })
}
