import { TARGET_ID } from '@scripts/scroll-to'
import { Container, getData, isEn, logError } from '@utils'

interface ItemOptions {
  condition: boolean
  item: HTMLDivElement
}

interface ValueOptions {
  name: string
  cards: NodeListOf<HTMLDivElement>
  plug: HTMLDivElement | null
}

interface LineOptions {
  line: HTMLSpanElement | null
  category: HTMLButtonElement | HTMLAnchorElement
}

const DATA_FILTER = getData('filtering')
const DATA_ACTIVE = getData('active')
const HIDDEN_CLASSNAME = 'hidden'
const OPACITY_CLASSNAME = 'opacity-0'
const TRANSLATE_CLASSNAME = 'translate-y-10'
const TRANSITION_CLASSNAMES = ['transition', 'ease-linear']

const addTransition = (item: HTMLDivElement) => {
  item.classList.add(...TRANSITION_CLASSNAMES)
}

const checkItem = ({ condition, item }: ItemOptions) => {
  if (condition) {
    item.classList.add(HIDDEN_CLASSNAME, OPACITY_CLASSNAME, TRANSLATE_CLASSNAME)
  } else {
    item.classList.remove(HIDDEN_CLASSNAME)

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        item.classList.remove(OPACITY_CLASSNAME, TRANSLATE_CLASSNAME)
      })
    })
  }
}

const checkValue = ({ name, cards, plug }: ValueOptions) => {
  cards.forEach((card) => {
    const value = card.dataset.filteringValue

    if (!value) return

    const absence = value.split(' ').includes(name) === false
    const showAll = name.toLowerCase() === 'all'

    checkItem({ condition: absence && !showAll, item: card })
  })

  const allHidden = ([...cards] as HTMLDivElement[]).every((card) => {
    return card.classList.contains(HIDDEN_CLASSNAME)
  })

  if (plug) {
    checkItem({ condition: !allHidden, item: plug })
  }
}

const updateLinePosition = ({ line, category }: LineOptions) => {
  if (!line) return

  line.style.width = `${category.offsetWidth}px`
  line.style.left = `${category.offsetLeft}px`
}

export default (container: Container = document) => {
  const filters = container.querySelectorAll<HTMLDivElement>(`*[${DATA_FILTER}]`)

  if (!filters.length) return

  const resizeObserver = new ResizeObserver((entries) => {
    if (!entries.length) return

    entries.forEach((entry) => {
      const category = entry.target as HTMLButtonElement | HTMLAnchorElement
      const filter: HTMLDivElement | null = category.closest(`[${DATA_FILTER}]`)

      if (!filter) return

      const value = filter.dataset.filtering

      if (!value) return

      const line: HTMLSpanElement | null = container.querySelector(`*[${DATA_FILTER}-line="${value}"]`)

      if (line && category.hasAttribute(DATA_ACTIVE)) {
        window.requestAnimationFrame(() => {
          updateLinePosition({ line, category })
        })
      }
    })
  })

  filters.forEach((filter) => {
    const value = filter.dataset.filtering

    if (!value) return

    const categories = container.querySelectorAll<HTMLButtonElement | HTMLAnchorElement>(
      `*[${DATA_FILTER}-category="${value}"]`
    )

    if (!categories.length) {
      logError(
        isEn
          ? `The ${DATA_FILTER} does not have a ${DATA_FILTER}-category child element`
          : `У ${DATA_FILTER} отсутствует дочерний элемент ${DATA_FILTER}-category`
      )
      return
    }

    const cards = container.querySelectorAll<HTMLDivElement>(`*[${DATA_FILTER}-card="${value}"]`)
    const plug: HTMLDivElement | null = container.querySelector(`*[${DATA_FILTER}-plug="${value}"]`)
    const line: HTMLSpanElement | null = container.querySelector(`*[${DATA_FILTER}-line="${value}"]`)

    const getCurrentCategory = () => {
      let active = categories[0]

      if (categories.length) {
        categories.forEach((category) => {
          if (category.hasAttribute(DATA_ACTIVE)) {
            active = category
          }
        })
      }

      return active
    }

    const setCurrentCategory = (category: HTMLButtonElement | HTMLAnchorElement) => {
      const active = getCurrentCategory()
      const name = category.dataset.filteringValue

      if (!name) return

      active.removeAttribute(DATA_ACTIVE)
      category.setAttribute(DATA_ACTIVE, '')
      updateLinePosition({ line, category })
      checkValue({ name, cards, plug })
    }

    if (cards.length) {
      cards.forEach((card) => {
        addTransition(card)
      })
    }

    if (plug) {
      addTransition(plug)
    }

    setCurrentCategory(getCurrentCategory())

    if (categories.length) {
      categories.forEach((category) => {
        const setCurrentCards = () => {
          setCurrentCategory(category)
        }

        resizeObserver.observe(category)
        category.addEventListener('click', setCurrentCards)
      })
    }

    if (TARGET_ID) {
      for (const [index, card] of cards.entries()) {
        if (card.querySelector(`#${TARGET_ID}`)) {
          const category = categories[index]

          if (category) {
            setCurrentCategory(category)
          }
        }
      }
    }
  })
}
