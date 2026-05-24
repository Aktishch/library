import { targetId } from '@ts/scroll-to'
import { Container, getData } from '@utils'

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

interface LinePosition {
  line: HTMLSpanElement
  category: Category
}

const DATA_FILTER: string = getData('filtering')
const DATA_ACTIVE: string = getData('active')

const addTransition = (item: HTMLDivElement): void => {
  item.classList.add('transition', 'ease-linear')
}

const checkItem = ({ condition, item }: CheckedItem): void => {
  if (condition) {
    item.classList.add('hidden', 'translate-y-10', 'opacity-0')
  } else {
    item.classList.remove('hidden')

    window.requestAnimationFrame((): void => {
      window.requestAnimationFrame((): void => {
        item.classList.remove('translate-y-10', 'opacity-0')
      })
    })
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

  const allHidden: boolean = ([...cards] as HTMLDivElement[]).every((card: HTMLDivElement): boolean => {
    return card.classList.contains('hidden')
  })

  if (plug) {
    checkItem({ condition: !allHidden, item: plug })
  }
}

const updateLinePosition = ({ line, category }: LinePosition): void => {
  if (!line) return

  line.style.width = `${category.offsetWidth}px`
  line.style.left = `${category.offsetLeft}px`
}

export default (container: Container = document): void => {
  const filters = container.querySelectorAll(`*[${DATA_FILTER}]`) as NodeListOf<HTMLDivElement>

  if (!filters.length) return

  const resizeObserver: ResizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]): void => {
    entries.forEach((entry: ResizeObserverEntry): void => {
      const category = entry.target as Category
      const filter = category.closest(`[${DATA_FILTER}]`) as HTMLDivElement

      if (!filter) return

      const value: string | undefined = filter.dataset.filtering

      if (!value) return

      const line = container.querySelector(`*[${DATA_FILTER}-line="${value}"]`) as HTMLSpanElement

      if (line && category.hasAttribute(DATA_ACTIVE)) {
        updateLinePosition({ line, category })
      }
    })
  })

  filters.forEach((filter: HTMLDivElement): void => {
    const value: string | undefined = filter.dataset.filtering

    if (!value) return

    const categories = container.querySelectorAll(`*[${DATA_FILTER}-category="${value}"]`) as NodeListOf<Category>
    const cards = container.querySelectorAll(`*[${DATA_FILTER}-card="${value}"]`) as NodeListOf<HTMLDivElement>
    const plug = container.querySelector(`*[${DATA_FILTER}-plug="${value}"]`) as HTMLDivElement
    const line = container.querySelector(`*[${DATA_FILTER}-line="${value}"]`) as HTMLSpanElement

    const getCurrentCategory = (): Category => {
      let active = categories[0] as Category

      categories.forEach((category: Category): void => {
        if (!category) return

        if (category.hasAttribute(DATA_ACTIVE)) {
          active = category
        }
      })

      return active
    }

    const setCurrentCard = (category: Category): void => {
      const active = getCurrentCategory() as Category
      const name: string | undefined = category.dataset.filteringValue

      if (!name) return

      active.removeAttribute(DATA_ACTIVE)
      category.setAttribute(DATA_ACTIVE, '')

      updateLinePosition({ line, category })
      checkValue({ name, cards, plug })
    }

    cards.forEach((card: HTMLDivElement): void => {
      if (!card) return

      addTransition(card)
    })

    if (plug) {
      addTransition(plug)
    }

    setCurrentCard(getCurrentCategory())

    categories.forEach((category: Category): void => {
      if (!category) return

      resizeObserver.observe(category)

      category.addEventListener('click', ((): void => {
        setCurrentCard(category)
      }) as EventListener)
    })

    if (targetId && targetId !== '') {
      for (const [index, card] of cards.entries()) {
        if (card.querySelector(`#${targetId}`)) {
          const category = categories[index] as Category

          if (!category) return

          setCurrentCard(category)
        }
      }
    }
  })
}
