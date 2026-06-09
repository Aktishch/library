import { Container, getData, source } from '@utils'

type World = HTMLElement | null
type WorldMap = SVGSVGElement | null
type Flag = HTMLImageElement | null
type Title = HTMLElement | null
type Path = SVGPathElement | null
type Value = string | undefined

const DATA_WORLD: string = getData('world')
const VISIBLE_CLASSNAMES: string[] = ['invisible', 'opacity-0']

export default (container: Container = document): void => {
  const world: World = container.querySelector(`*[${DATA_WORLD}]`)

  if (!world) return

  const map: WorldMap = world.querySelector(`*[${DATA_WORLD}-map]`)

  if (!map) return

  const countries: NodeListOf<HTMLAnchorElement> = map.querySelectorAll(`*[${DATA_WORLD}-country]`)
  const flag: Flag = world.querySelector(`*[${DATA_WORLD}-flag]`)
  const title: Title = world.querySelector(`*[${DATA_WORLD}-title]`)

  if (!countries.length) return

  countries.forEach((country: HTMLAnchorElement): void => {
    const path: Path = country.querySelector('path')

    if (!path) return

    const image: SVGImageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    const rect: SVGRectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    const text: SVGTextElement = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    const pathBox: DOMRect = path.getBBox()
    const centerY: number = pathBox.y + pathBox.height / 2
    const centerX: number = pathBox.x + pathBox.width / 2
    const iconSize: number = 20
    const padding: number = 4
    const worldCountry: Value = country.dataset.worldCountry
    const worldSource: Value = country.dataset.worldSource

    const onOver = (): void => {
      rect.classList.remove(...VISIBLE_CLASSNAMES)
      text.classList.remove(...VISIBLE_CLASSNAMES)
    }

    const onLeave = (): void => {
      rect.classList.add(...VISIBLE_CLASSNAMES)
      text.classList.add(...VISIBLE_CLASSNAMES)
    }

    const onClick = (): void => {
      if (flag && worldSource) {
        flag.src = worldSource
      }

      if (title && worldCountry) {
        title.innerText = worldCountry
      }
    }

    image.classList.add('pointer-events-none')
    rect.classList.add('pointer-events-none', 'fill-white', 'invisible', 'opacity-0', 'transition-opacity')
    text.classList.add('pointer-events-none', 'invisible', 'opacity-0', 'transition-opacity', 'fill-black', 'text-sm')
    image.setAttribute('href', `${source}/img/pictures/flag.svg`)
    image.setAttribute('width', String(iconSize))
    image.setAttribute('height', String(iconSize))
    image.setAttribute('y', String(centerY - iconSize - 5))
    image.setAttribute('x', String(centerX - iconSize / 2))

    if (worldCountry) {
      text.textContent = worldCountry
    }

    map.appendChild(image)
    map.appendChild(rect)
    map.appendChild(text)

    const textBox: DOMRect = text.getBBox()
    const textY: number = centerY + 15
    const textX: number = centerX - textBox.width / 2

    text.setAttribute('y', String(textY))
    text.setAttribute('x', String(textX))
    rect.setAttribute('width', String(textBox.width + padding * 2))
    rect.setAttribute('height', String(textBox.height + padding * 2))
    rect.setAttribute('x', String(textX - padding))
    rect.setAttribute('y', String(textY - textBox.height))
    rect.setAttribute('rx', '2')
    path.addEventListener('mouseover', onOver as EventListener)
    path.addEventListener('mouseleave', onLeave as EventListener)
    country.addEventListener('click', onClick as EventListener)
  })
}
