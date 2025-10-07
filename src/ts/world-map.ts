export default (): void => {
  const world = document.querySelector('*[data-world]') as HTMLElement

  if (!world) return

  const map = world.querySelector('*[data-world-map]') as SVGElement
  const countries = map.querySelectorAll('*[data-world-country]') as NodeListOf<HTMLAnchorElement>
  const flag = world.querySelector('*[data-world-flag]') as HTMLImageElement
  const title = world.querySelector('*[data-world-title]') as HTMLElement
  const offsetY: number = map.getBoundingClientRect().y
  const offsetX: number = map.getBoundingClientRect().x
  const ratio: number = 880 / map.getBoundingClientRect().width

  countries.forEach((country: HTMLAnchorElement): void => {
    const path = country.querySelector('path') as SVGPathElement
    const pathHeight: number = path.getBoundingClientRect().height * ratio
    const pathWidth: number = path.getBoundingClientRect().width * ratio
    const positionY: number = (path.getBoundingClientRect().y - offsetY) * ratio + pathHeight / 2
    const positionX: number = (path.getBoundingClientRect().x - offsetX) * ratio + pathWidth / 2
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image') as SVGImageElement
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect') as SVGRectElement
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text') as SVGTextElement

    const elementsShow = (): void => {
      rect.classList.remove('invisible', 'opacity-0')
      text.classList.remove('invisible', 'opacity-0')
    }

    const elementsHidden = (): void => {
      rect.classList.add('invisible', 'opacity-0')
      text.classList.add('invisible', 'opacity-0')
    }

    const currentCountry = (): void => {
      flag.src = String(country.dataset.worldSource)
      title.innerText = String(country.dataset.worldCountry)
    }

    image.classList.add('pointer-events-none', 'size-5')
    rect.classList.add('pointer-events-none', 'fill-white', 'invisible', 'opacity-0', 'transition-opacity')
    text.classList.add('pointer-events-none', 'invisible', 'opacity-0', 'transition-opacity', 'fill-black', 'text-sm')
    map.appendChild(image)
    map.appendChild(rect)
    map.appendChild(text)
    image.setAttribute('href', '/img/pictures/flag.svg')
    image.setAttribute('y', `${positionY - (image.getBoundingClientRect().height * ratio) / 1.2}`)
    image.setAttribute('x', `${positionX}`)
    text.innerHTML = String(country.dataset.worldCountry)
    text.setAttribute('y', `${positionY + (text.getBoundingClientRect().height * ratio) / 1.2}`)
    text.setAttribute('x', `${positionX}`)
    rect.setAttribute('width', `${text.getBoundingClientRect().width}`)
    rect.setAttribute('height', `${text.getBoundingClientRect().height}`)
    rect.setAttribute('y', `${positionY}`)
    rect.setAttribute('x', `${positionX}`)
    rect.setAttribute('rx', '2')

    path.addEventListener('mouseover', elementsShow as EventListener)
    path.addEventListener('mouseleave', elementsHidden as EventListener)
    country.addEventListener('click', currentCountry as EventListener)
  })
}
