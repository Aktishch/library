import { targetId } from '@ts/scroll-to'
import { Container, getData, isEn, logError } from '@utils'

type Filter = HTMLDivElement | null
type Category = HTMLButtonElement | HTMLAnchorElement
type Plug = HTMLDivElement | null
type Line = HTMLSpanElement | null
type Value = string | undefined

interface CheckedItem {
  condition: boolean
  item: HTMLDivElement
}

interface CheckedValue {
  name: string
  cards: NodeListOf<HTMLDivElement>
  plug: Plug
}

interface LinePosition {
  line: Line
  category: Category
}

const DATA_FILTER: string = getData('filtering')
const DATA_ACTIVE: string = getData('active')

const handleCategoriesError = (): void => {
  logError(
    isEn
      ? `The ${DATA_FILTER} does not have a ${DATA_FILTER}-category child element`
      : `У ${DATA_FILTER} отсутствует дочерний элемент ${DATA_FILTER}-category`
  )
}

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
    const value: Value = card.dataset.filteringValue

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
  const filters: NodeListOf<HTMLDivElement> = container.querySelectorAll(`*[${DATA_FILTER}]`)

  if (!filters.length) return

  const resizeObserver: ResizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]): void => {
    entries.forEach((entry: ResizeObserverEntry): void => {
      const category: Category = entry.target as Category
      const filter: Filter = category.closest(`[${DATA_FILTER}]`)

      if (!filter) return

      const value: Value = filter.dataset.filtering

      if (!value) return

      const line: Line = container.querySelector(`*[${DATA_FILTER}-line="${value}"]`)

      if (line && category.hasAttribute(DATA_ACTIVE)) {
        updateLinePosition({ line, category })
      }
    })
  })

  filters.forEach((filter: HTMLDivElement): void => {
    const value: Value = filter.dataset.filtering

    if (!value) return

    const categories: NodeListOf<Category> = container.querySelectorAll(`*[${DATA_FILTER}-category="${value}"]`)

    if (!categories.length) {
      return handleCategoriesError()
    }

    const cards: NodeListOf<HTMLDivElement> = container.querySelectorAll(`*[${DATA_FILTER}-card="${value}"]`)
    const plug: Plug = container.querySelector(`*[${DATA_FILTER}-plug="${value}"]`)
    const line: Line = container.querySelector(`*[${DATA_FILTER}-line="${value}"]`)

    const getCurrentCategory = (): Category => {
      let active: Category = categories[0]

      if (categories.length) {
        categories.forEach((category: Category): void => {
          if (category.hasAttribute(DATA_ACTIVE)) {
            active = category
          }
        })
      }

      return active
    }

    const setCurrentCategory = (category: Category): void => {
      const active: Category = getCurrentCategory()
      const name: Value = category.dataset.filteringValue

      if (!name) return

      active.removeAttribute(DATA_ACTIVE)
      category.setAttribute(DATA_ACTIVE, '')
      updateLinePosition({ line, category })
      checkValue({ name, cards, plug })
    }

    if (cards.length) {
      cards.forEach((card: HTMLDivElement): void => {
        addTransition(card)
      })
    }

    if (plug) {
      addTransition(plug)
    }

    setCurrentCategory(getCurrentCategory())

    if (categories.length) {
      categories.forEach((category: Category): void => {
        const setCurrentCards = (): void => {
          setCurrentCategory(category)
        }

        resizeObserver.observe(category)

        category.addEventListener('click', setCurrentCards as EventListener)
      })
    }

    if (targetId) {
      for (const [index, card] of cards.entries()) {
        if (card.querySelector(`#${targetId}`)) {
          const category: Category = categories[index]

          if (category) {
            setCurrentCategory(category)
          }
        }
      }
    }
  })
}
