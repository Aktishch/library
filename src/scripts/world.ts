import { Container, getData, source } from '@utils'

const DATA_WORLD = getData('world')
const ICON_SIZE = 24
const PADDING = 4
const VISIBLE_CLASSNAMES = ['invisible', 'opacity-0']
const IMAGE_CLASSNAME = 'pointer-events-none'
const RECT_CLASSNAMES = ['pointer-events-none', 'fill-white', 'invisible', 'opacity-0', 'transition-opacity']
const TEXT_CLASSNAMES = ['pointer-events-none', 'invisible', 'opacity-0', 'transition-opacity', 'fill-black', 'text-sm']

export default (container: Container = document) => {
  const world: HTMLElement | null = container.querySelector(`*[${DATA_WORLD}]`)

  if (!world) return

  const map: SVGSVGElement | null = world.querySelector(`*[${DATA_WORLD}-map]`)

  if (!map) return

  const countries = map.querySelectorAll<HTMLAnchorElement>(`*[${DATA_WORLD}-country]`)
  const flag: HTMLImageElement | null = world.querySelector(`*[${DATA_WORLD}-flag]`)
  const title: HTMLElement | null = world.querySelector(`*[${DATA_WORLD}-title]`)

  if (!countries.length) return

  countries.forEach((country) => {
    const path = country.querySelector('path')

    if (!path) return

    const { y, x, width, height } = path.getBBox()
    const centerY = y + height / 2
    const centerX = x + width / 2
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    const worldCountry = country.dataset.worldCountry
    const worldSource = country.dataset.worldSource

    const onOver = () => {
      rect.classList.remove(...VISIBLE_CLASSNAMES)
      text.classList.remove(...VISIBLE_CLASSNAMES)
    }

    const onLeave = () => {
      rect.classList.add(...VISIBLE_CLASSNAMES)
      text.classList.add(...VISIBLE_CLASSNAMES)
    }

    const onClick = () => {
      if (flag && worldSource) {
        flag.src = worldSource
      }

      if (title && worldCountry) {
        title.innerText = worldCountry
      }
    }

    image.classList.add(IMAGE_CLASSNAME)
    rect.classList.add(...RECT_CLASSNAMES)
    text.classList.add(...TEXT_CLASSNAMES)
    image.setAttribute('href', `${source}/img/pictures/flag.svg`)
    image.setAttribute('width', String(ICON_SIZE))
    image.setAttribute('height', String(ICON_SIZE))
    image.setAttribute('y', String(centerY - ICON_SIZE - 5))
    image.setAttribute('x', String(centerX - ICON_SIZE / 2))

    if (worldCountry) {
      text.textContent = worldCountry
    }

    map.appendChild(image)
    map.appendChild(rect)
    map.appendChild(text)

    const textBox = text.getBBox()
    const textY = centerY + 15
    const textX = centerX - textBox.width / 2

    text.setAttribute('y', String(textY))
    text.setAttribute('x', String(textX))
    rect.setAttribute('width', String(textBox.width + PADDING * 2))
    rect.setAttribute('height', String(textBox.height + PADDING * 2))
    rect.setAttribute('x', String(textX - PADDING))
    rect.setAttribute('y', String(textY - textBox.height))
    rect.setAttribute('rx', '2')
    path.addEventListener('mouseover', onOver)
    path.addEventListener('mouseleave', onLeave)
    country.addEventListener('click', onClick)
  })
}
