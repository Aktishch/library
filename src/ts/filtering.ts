import { scrollToElement } from '@ts/scroll-to'
import { Container } from '@utils'

interface FilterCardsShowing {
  condition: boolean
  item: HTMLDivElement
}

interface FilterHandler {
  name: string
  cards: NodeListOf<HTMLDivElement>
  plug: HTMLDivElement
}

type FilterCategory = HTMLButtonElement | HTMLAnchorElement

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
    const value: string | undefined = card.dataset.filteringValue

    if (!value) return

    const absence: boolean = value.split(' ').includes(name) === false
    const showAll: boolean = name.toLowerCase() === 'all'

    filterCardsShowing({ condition: absence && !showAll, item: card })
  })

  const allHidden: boolean = ([...cards] as HTMLDivElement[]).every((card: HTMLDivElement): boolean =>
    card.classList.contains('hidden')
  )

  if (plug) filterCardsShowing({ condition: !allHidden, item: plug })
}

export default (container: Container = document): void => {
  const filters = container.querySelectorAll('*[data-filtering]') as NodeListOf<HTMLDivElement>

  filters.forEach((filter: HTMLDivElement): void => {
    if (!filter || !filter.dataset.filtering) return

    const value: string = filter.dataset.filtering
    const hash: string = window.location.hash.slice(1)
    const categories = container.querySelectorAll(`*[data-filtering-category="${value}"]`) as NodeListOf<FilterCategory>
    const cards = container.querySelectorAll(`*[data-filtering-card="${value}"]`) as NodeListOf<HTMLDivElement>
    const plug = container.querySelector(`*[data-filtering-plug="${value}"]`) as HTMLDivElement
    const line = container.querySelector(`*[data-filtering-line="${value}"]`) as HTMLSpanElement

    const currentCategory = (): FilterCategory => {
      let active = categories[0] as FilterCategory

      categories.forEach((category: FilterCategory): void => {
        if (category.hasAttribute('data-active')) active = category
      })

      return active
    }

    const currentCard = (category: FilterCategory): void => {
      const active = currentCategory() as FilterCategory
      const name: string | undefined = category.dataset.filteringValue

      if (!name) return

      active.removeAttribute('data-active')
      category.setAttribute('data-active', '')

      if (line) {
        line.style.width = `${category.offsetWidth}px`
        line.style.left = `${category.offsetLeft}px`
      }

      filterHandler({ name, cards, plug })
    }

    cards.forEach((card: HTMLDivElement): void => {
      if (card) addTransition(card)
    })

    if (plug) addTransition(plug)

    currentCard(currentCategory())

    categories.forEach((category: FilterCategory): void => {
      if (!category) return

      category.addEventListener('click', ((): void => {
        currentCard(category)
      }) as EventListener)
    })

    if (hash && hash !== '') {
      for (const [index, card] of cards.entries()) {
        if (card.querySelector(`#${hash}`)) {
          const category = categories[index] as FilterCategory

          currentCard(category)
          setTimeout((): void => scrollToElement(filter), 50)
        }
      }
    }
  })
}
