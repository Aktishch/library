import { scrollToElement } from './scroll-to'

type FilterCardsShowing = {
  condition: boolean
  item: HTMLDivElement
}

type FilterHandler = {
  name: string
  cards: NodeListOf<HTMLDivElement>
  plug: HTMLDivElement
}

const addTransition = (item: HTMLDivElement): void => {
  item.classList.add('transition', 'ease-linear')
}

const filterCardsShowing = ({ condition, item }: FilterCardsShowing): void => {
  if (condition) {
    item.classList.add('hidden', 'translate-y-10', 'opacity-0')
  } else {
    item.classList.remove('hidden')
    setTimeout((): void => item.classList.remove('translate-y-10', 'opacity-0'), 50)
  }
}

const filterHandler = ({ name, cards, plug }: FilterHandler): void => {
  cards.forEach((card: HTMLDivElement): void => {
    const absence: boolean = String(card.dataset.filteringValue).split(' ').includes(name) === false
    const showAll: boolean = name.toLowerCase() === 'all'

    filterCardsShowing({ condition: absence && !showAll, item: card })
  })

  const allHidden: boolean = ([...cards] as HTMLDivElement[]).every((card: HTMLDivElement) =>
    card.classList.contains('hidden')
  )

  if (plug) filterCardsShowing({ condition: !allHidden, item: plug })
}

export default (): void => {
  const filters = document.querySelectorAll('*[data-filtering]') as NodeListOf<HTMLDivElement>

  filters.forEach((filter: HTMLDivElement): void => {
    if (!filter) return

    const value: string = String(filter.dataset.filtering)
    const hash: string = window.location.hash.substr(1)
    const categories = document.querySelectorAll(`*[data-filtering-category="${value}"]`) as NodeListOf<HTMLElement>
    const cards = document.querySelectorAll(`*[data-filtering-card="${value}"]`) as NodeListOf<HTMLDivElement>
    const plug = document.querySelector(`*[data-filtering-plug="${value}"]`) as HTMLDivElement
    const line = document.querySelector(`*[data-filtering-line="${value}"]`) as HTMLSpanElement

    const currentCategory = (): HTMLElement => {
      let active = categories[0] as HTMLElement

      categories.forEach((category: HTMLElement): void => {
        if (category.classList.contains('filtering-active')) active = category
      })

      return active
    }

    const currentCard = (category: HTMLElement): void => {
      const active = currentCategory() as HTMLElement
      const name: string = String(category.dataset.filteringValue)

      active.classList.remove('filtering-active')
      category.classList.add('filtering-active')

      if (line) {
        line.style.width = `${category.offsetWidth}px`
        line.style.left = `${category.offsetLeft}px`
      }

      filterHandler({ name, cards, plug })
    }

    cards.forEach((card: HTMLDivElement): void => {
      if (!card) return

      addTransition(card)
    })

    if (plug) addTransition(plug)

    currentCard(currentCategory())

    categories.forEach((category: HTMLElement): void => {
      if (!category) return

      category.addEventListener('click', ((): void => {
        currentCard(category)
      }) as EventListener)
    })

    if (hash && hash !== '') {
      for (const [index, card] of cards.entries()) {
        if (card.querySelector(`#${hash}`)) {
          const category = categories[index] as HTMLElement

          currentCard(category)

          setTimeout((): void => scrollToElement(filter), 100)
        }
      }
    }
  })
}
