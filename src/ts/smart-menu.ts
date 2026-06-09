import { Container, getData, isEn, logError } from '@utils'

type Smart = HTMLDivElement | null
type Title = HTMLHeadingElement | null
type Listing = HTMLUListElement | null
type Nav = HTMLDivElement | null
type Count = HTMLSpanElement | null
type Li = Element | null

interface CheckedItem {
  condition: boolean
  item: HTMLElement
}

const DATA_SMART: string = getData('smart')
const HIDDEN_CLASSNAME: string = 'hidden'

const handleElementsError = (): void => {
  logError(
    isEn
      ? `The ${DATA_SMART} does not have a ${DATA_SMART}-(title, length, nav, count, list) child element`
      : `У ${DATA_SMART} отсутствует дочерний элемент ${DATA_SMART}-(title, length, nav, count, list)`
  )
}

const checkItem = ({ condition, item }: CheckedItem): void => {
  if (condition) {
    item.classList.add(HIDDEN_CLASSNAME)
  } else {
    item.classList.remove(HIDDEN_CLASSNAME)
  }
}

export default (container: Container = document): void => {
  const smartMenu: Smart = container.querySelector(`*[${DATA_SMART}]`)

  if (!smartMenu) return

  const title: Title = smartMenu.querySelector(`*[${DATA_SMART}-title]`)
  const length: Listing = smartMenu.querySelector(`*[${DATA_SMART}-length]`)
  const nav: Nav = smartMenu.querySelector(`*[${DATA_SMART}-nav]`)
  const count: Count = smartMenu.querySelector(`*[${DATA_SMART}-count]`)
  const list: Listing = smartMenu.querySelector(`*[${DATA_SMART}-list]`)

  if (!title || !length || !nav || !count || !list) {
    handleElementsError()
    return
  }

  const breaks: number[] = []

  const updateSmartMenu = (): void => {
    window.requestAnimationFrame((): void => {
      const lengthWidth: number = length.offsetWidth
      const smartMenuWidth: number = nav.classList.contains(HIDDEN_CLASSNAME)
        ? smartMenu.offsetWidth
        : smartMenu.offsetWidth - nav.offsetWidth

      if (smartMenuWidth > 0 && smartMenuWidth < lengthWidth) {
        const lastChild: Li = length.lastElementChild

        breaks.push(lengthWidth)

        if (lastChild) {
          list.prepend(lastChild)
          updateSmartMenu()
        }
      } else {
        if (smartMenuWidth > breaks[breaks.length - 1]) {
          const firstChild: Li = list.firstElementChild

          breaks.pop()

          if (firstChild) {
            length.append(firstChild)
          }
        }
      }

      count.innerText = String(breaks.length)

      const items: NodeListOf<HTMLLIElement> = list.querySelectorAll('li')

      checkItem({ condition: items.length === 0, item: nav })
      checkItem({ condition: lengthWidth !== 0, item: title })
    })
  }

  const resizeObserver: ResizeObserver = new ResizeObserver((): void => {
    updateSmartMenu()
  })

  updateSmartMenu()
  resizeObserver.observe(smartMenu)
}
