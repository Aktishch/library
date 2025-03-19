export default (): void => {
  const smartMenu = document.querySelector('*[data-smart]') as HTMLDivElement

  if (!smartMenu) return

  const title = smartMenu.querySelector('*[data-smart-title]') as HTMLElement
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
      count.innerText = String(breaks.length)
      updateSmartMenu()
    } else {
      if (smartMenuWidth > breaks[breaks.length - 1]) {
        breaks.pop()
        length.append(list.firstElementChild as HTMLLIElement)
        count.innerText = String(breaks.length)
      }
    }

    const items = list.querySelectorAll('li') as NodeListOf<HTMLLIElement>

    items.length === 0 ? nav.classList.add('hidden') : nav.classList.remove('hidden')
    lengthWidth === 0 ? title.classList.remove('hidden') : title.classList.add('hidden')
  }

  updateSmartMenu()
  window.addEventListener('resize', updateSmartMenu as EventListener)
}
