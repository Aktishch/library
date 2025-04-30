export default (): void => {
  const listings = document.querySelectorAll('*[data-listing]') as NodeListOf<HTMLElement>

  listings.forEach((listing: HTMLElement): void => {
    if (!listing) return

    const show = listing.querySelector('*[data-listing-show]') as HTMLButtonElement
    const items = listing.querySelectorAll('*[data-listing-item]') as NodeListOf<HTMLDivElement>

    items.forEach((item: HTMLDivElement): void => {
      if (!item) return

      item.classList.add('hidden')
    })

    show.addEventListener('click', ((): void => {
      const items = listing.querySelectorAll('*[data-listing-item]') as NodeListOf<HTMLDivElement>
      const count: number = Number(listing.dataset.listing) || items.length

      for (let i: number = 0; i < count; i++) {
        const item = items[i] as HTMLDivElement

        if (item) {
          if (item.hasAttribute('data-anim')) item.dataset.anim = 'show'

          item.removeAttribute('data-listing-item')
          item.classList.remove('hidden')
        }

        if (!item || items.length === count) show.remove()
      }
    }) as EventListener)
  })
}
