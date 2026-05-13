import { targetId } from '@ts/scroll-to'
import { Container } from '@utils'

interface CheckedItem {
  condition: boolean
  item: HTMLDivElement
}

interface CheckedValue {
  name: string
  cards: NodeListOf<HTMLDivElement>
  plug: HTMLDivElement
}

type Category = HTMLButtonElement | HTMLAnchorElement

const addTransition = (item: HTMLDivElement): void => {
  item.classList.add('transition', 'ease-linear')
}

const checkItem = ({ condition, item }: CheckedItem): void => {
  if (condition) {
    item.classList.add('hidden', 'translate-y-10', 'opacity-0')
  } else {
    item.classList.remove('hidden')
    setTimeout((): void => item.classList.remove('translate-y-10', 'opacity-0'), 50)
  }
}

const checkValue = ({ name, cards, plug }: CheckedValue): void => {
  cards.forEach((card: HTMLDivElement): void => {
    const value: string | undefined = card.dataset.filteringValue

    if (!value) return

    const absence: boolean = value.split(' ').includes(name) === false
    const showAll: boolean = name.toLowerCase() === 'all'

    checkItem({ condition: absence && !showAll, item: card })
  })

  const allHidden: boolean = ([...cards] as HTMLDivElement[]).every((card: HTMLDivElement): boolean =>
    card.classList.contains('hidden')
  )

  if (plug) checkItem({ condition: !allHidden, item: plug })
}

export default (container: Container = document): void => {
  const filters = container.querySelectorAll('*[data-filtering]') as NodeListOf<HTMLDivElement>

  filters.forEach((filter: HTMLDivElement): void => {
    if (!filter || !filter.dataset.filtering) return

    const value: string = filter.dataset.filtering
    const categories = container.querySelectorAll(`*[data-filtering-category="${value}"]`) as NodeListOf<Category>
    const cards = container.querySelectorAll(`*[data-filtering-card="${value}"]`) as NodeListOf<HTMLDivElement>
    const plug = container.querySelector(`*[data-filtering-plug="${value}"]`) as HTMLDivElement
    const line = container.querySelector(`*[data-filtering-line="${value}"]`) as HTMLSpanElement

    const getCurrentCategory = (): Category => {
      let active = categories[0] as Category

      categories.forEach((category: Category): void => {
        if (category.hasAttribute('data-active')) active = category
      })

      return active
    }

    const setCurrentCard = (category: Category): void => {
      const active = getCurrentCategory() as Category
      const name: string | undefined = category.dataset.filteringValue

      if (!name) return

      active.removeAttribute('data-active')
      category.setAttribute('data-active', '')

      if (line) {
        line.style.width = `${category.offsetWidth}px`
        line.style.left = `${category.offsetLeft}px`
      }

      checkValue({ name, cards, plug })
    }

    cards.forEach((card: HTMLDivElement): void => {
      if (card) addTransition(card)
    })

    if (plug) addTransition(plug)

    setCurrentCard(getCurrentCategory())

    categories.forEach((category: Category): void => {
      if (!category) return

      category.addEventListener('click', ((): void => {
        setCurrentCard(category)
      }) as EventListener)
    })

    if (targetId && targetId !== '') {
      for (const [index, card] of cards.entries()) {
        if (card.querySelector(`#${targetId}`)) {
          const category = categories[index] as Category

          if (category) setCurrentCard(category)
        }
      }
    }
  })
}
