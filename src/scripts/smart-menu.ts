import { getData, isEn, logError } from '@utils'

interface SmartOptions {
  condition: boolean
  item: HTMLElement
}

const DATA_SMART = getData('smart')
const HIDDEN_CLASSNAME = 'hidden'

const checkItem = ({ condition, item }: SmartOptions) => {
  if (condition) {
    item.classList.add(HIDDEN_CLASSNAME)
  } else {
    item.classList.remove(HIDDEN_CLASSNAME)
  }
}

export default (container: Document | HTMLElement = document) => {
  const smartMenu: HTMLDivElement | null = container.querySelector(`*[${DATA_SMART}]`)

  if (!smartMenu) return

  const title: HTMLHeadingElement | null = smartMenu.querySelector(`*[${DATA_SMART}-title]`)
  const length: HTMLUListElement | null = smartMenu.querySelector(`*[${DATA_SMART}-length]`)
  const nav: HTMLDivElement | null = smartMenu.querySelector(`*[${DATA_SMART}-nav]`)
  const count: HTMLSpanElement | null = smartMenu.querySelector(`*[${DATA_SMART}-count]`)
  const list: HTMLUListElement | null = smartMenu.querySelector(`*[${DATA_SMART}-list]`)

  if (!title || !length || !nav || !count || !list) {
    logError(
      isEn
        ? `The ${DATA_SMART} does not have a ${DATA_SMART}-(title, length, nav, count, list) child element`
        : `У ${DATA_SMART} отсутствует дочерний элемент ${DATA_SMART}-(title, length, nav, count, list)`
    )
    return
  }

  const breaks: number[] = []

  const updateSmartMenu = () => {
    window.requestAnimationFrame(() => {
      const lengthWidth = length.offsetWidth
      const smartMenuWidth = nav.classList.contains(HIDDEN_CLASSNAME)
        ? smartMenu.offsetWidth
        : smartMenu.offsetWidth - nav.offsetWidth

      if (smartMenuWidth > 0 && smartMenuWidth < lengthWidth) {
        const lastChild = length.lastElementChild

        breaks.push(lengthWidth)

        if (lastChild) {
          list.prepend(lastChild)
          updateSmartMenu()
        }
      } else {
        if (smartMenuWidth > breaks[breaks.length - 1]) {
          const firstChild = list.firstElementChild

          breaks.pop()

          if (firstChild) {
            length.append(firstChild)
          }
        }
      }

      count.innerText = String(breaks.length)

      const items = list.querySelectorAll<HTMLLIElement>('li')

      checkItem({ condition: items.length === 0, item: nav })
      checkItem({ condition: lengthWidth !== 0, item: title })
    })
  }

  const resizeObserver = new ResizeObserver(() => {
    updateSmartMenu()
  })

  updateSmartMenu()
  resizeObserver.observe(smartMenu)
}
