interface CheckedItem {
  condition: boolean
  item: HTMLElement
}

const className: string[] = ['hidden']

const checkItem = ({ condition, item }: CheckedItem): void => {
  if (condition) {
    item.classList.add(...className)
  } else {
    item.classList.remove(...className)
  }
}

export default (): void => {
  const smartMenu = document.querySelector('*[data-smart]') as HTMLDivElement

  if (!smartMenu) return

  const title = smartMenu.querySelector('*[data-smart-title]') as HTMLHeadingElement
  const length = smartMenu.querySelector('*[data-smart-length]') as HTMLUListElement
  const nav = smartMenu.querySelector('*[data-smart-nav]') as HTMLDivElement
  const count = smartMenu.querySelector('*[data-smart-count]') as HTMLSpanElement
  const list = smartMenu.querySelector('*[data-smart-list]') as HTMLUListElement
  const breaks: number[] = []

  const updateSmartMenu = (): void => {
    const lengthWidth: number = length.offsetWidth
    const smartMenuWidth: number = nav.classList.contains('hidden')
      ? smartMenu.offsetWidth
      : smartMenu.offsetWidth - nav.offsetWidth

    if (smartMenuWidth > 0 && smartMenuWidth < lengthWidth) {
      breaks.push(lengthWidth)
      list.prepend(length.lastElementChild as HTMLLIElement)
      updateSmartMenu()
    } else {
      if (smartMenuWidth > breaks[breaks.length - 1]) {
        breaks.pop()
        length.append(list.firstElementChild as HTMLLIElement)
      }
    }

    count.innerText = String(breaks.length)

    const items = list.querySelectorAll('li') as NodeListOf<HTMLLIElement>

    checkItem({ condition: items.length === 0, item: nav })
    checkItem({ condition: lengthWidth !== 0, item: title })
  }

  updateSmartMenu()
  window.addEventListener('resize', updateSmartMenu as EventListener)
}
