import { Container, getSource } from '@utils'

const className: string[] = ['invisible', 'opacity-0']

export default (container: Container = document): void => {
  const world = container.querySelector('*[data-world]') as HTMLElement

  if (!world) return

  const map = world.querySelector('*[data-world-map]') as SVGElement
  const countries = map.querySelectorAll('*[data-world-country]') as NodeListOf<HTMLAnchorElement>
  const flag = world.querySelector('*[data-world-flag]') as HTMLImageElement
  const title = world.querySelector('*[data-world-title]') as HTMLElement
  const offsetY: number = map.getBoundingClientRect().y
  const offsetX: number = map.getBoundingClientRect().x
  const ratio: number = 880 / map.getBoundingClientRect().width

  countries.forEach((country: HTMLAnchorElement): void => {
    if (!country) return

    const path = country.querySelector('path') as SVGPathElement
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image') as SVGImageElement
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect') as SVGRectElement
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text') as SVGTextElement
    const height: number = path.getBoundingClientRect().height * ratio
    const width: number = path.getBoundingClientRect().width * ratio
    const positionY: number = (path.getBoundingClientRect().y - offsetY) * ratio + height / 2
    const positionX: number = (path.getBoundingClientRect().x - offsetX) * ratio + width / 2

    image.classList.add('pointer-events-none', 'size-5')
    rect.classList.add('pointer-events-none', 'fill-white', 'invisible', 'opacity-0', 'transition-opacity')
    text.classList.add('pointer-events-none', 'invisible', 'opacity-0', 'transition-opacity', 'fill-black', 'text-sm')
    map.appendChild(image)
    map.appendChild(rect)
    map.appendChild(text)
    image.setAttribute('href', `${getSource()}/img/pictures/flag.svg`)
    image.setAttribute('y', String(positionY - (image.getBoundingClientRect().height * ratio) / 1.2))
    image.setAttribute('x', String(positionX))

    if (country.dataset.worldCountry) text.innerHTML = country.dataset.worldCountry

    text.setAttribute('y', String(positionY + (text.getBoundingClientRect().height * ratio) / 1.2))
    text.setAttribute('x', String(positionX))
    rect.setAttribute('width', String(text.getBoundingClientRect().width))
    rect.setAttribute('height', String(text.getBoundingClientRect().height))
    rect.setAttribute('y', String(positionY))
    rect.setAttribute('x', String(positionX))
    rect.setAttribute('rx', '2')

    path.addEventListener('mouseover', ((): void => {
      rect.classList.remove(...className)
      text.classList.remove(...className)
    }) as EventListener)

    path.addEventListener('mouseleave', ((): void => {
      rect.classList.add(...className)
      text.classList.add(...className)
    }) as EventListener)

    country.addEventListener('click', ((): void => {
      if (country.dataset.worldSource) flag.src = country.dataset.worldSource
      if (country.dataset.worldCountry) title.innerText = country.dataset.worldCountry
    }) as EventListener)
  })
}
