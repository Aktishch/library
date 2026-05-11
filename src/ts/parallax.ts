import { Container, Coordinates, getTouchDevice } from '@utils'

export default (container: Container = document): void => {
  if (getTouchDevice()) return

  const parallaxes = container.querySelectorAll('*[data-parallax]') as NodeListOf<HTMLElement>

  parallaxes.forEach((parallax: HTMLElement): void => {
    if (!parallax) return

    const layers = parallax.querySelectorAll('*[data-parallax-layer]') as NodeListOf<HTMLElement>
    const hovereds = parallax.querySelectorAll('*[data-parallax-hovered]') as NodeListOf<HTMLElement>

    layers.forEach((layer: HTMLElement): void => {
      if (!layer) return

      const speed: number = Number(layer.dataset.parallaxSpeed) / 100 || 0.05
      const depth: number = Number(layer.dataset.parallaxDepth) || 1
      let positionY: number = 0
      let positionX: number = 0
      let currentY: number = 0
      let currentX: number = 0

      const setParallaxPosition = (): void => {
        const initialY: number = currentY - positionY
        const initialX: number = currentX - positionX

        positionY += initialY * speed
        positionX += initialX * speed
        layer.style.transform =
          layer.dataset.parallaxLayer === 'reverse'
            ? `translate(${-positionX / depth}%, ${-positionY / depth}%)`
            : `translate(${positionX / depth}%, ${positionY / depth}%)`
        window.requestAnimationFrame(setParallaxPosition)
      }

      window.requestAnimationFrame(setParallaxPosition)

      parallax.addEventListener('mousemove', ((event: MouseEvent): void => {
        const height: number = parallax.offsetHeight
        const width: number = parallax.offsetWidth
        const coordinates: Coordinates = {
          top: event.clientY - height / 2,
          left: event.clientX - width / 2,
        }

        currentY = (coordinates.top / height) * 100
        currentX = (coordinates.left / width) * 100
      }) as EventListener)
    })

    hovereds.forEach((hovered: HTMLElement): void => {
      if (!hovered) return

      const perspective: number = Number(hovered.dataset.parallaxHovered) || 600
      const items = hovered.querySelectorAll('*[data-parallax-item]') as NodeListOf<HTMLElement>
      const depth: number = 10
      let positionY: number = 0
      let positionX: number = 0

      hovered.style.perspective = `${perspective}px`

      items.forEach((item: HTMLElement): void => {
        if (!item) return

        const translateZ: number = Number(item.dataset.parallaxItem) || 100

        item.style.transform = `rotateX(var(--rotate-x)) rotateY(var(--rotate-y)) translateZ(${translateZ}px)`
      })

      hovered.addEventListener('mousemove', ((event: MouseEvent): void => {
        const rect: DOMRect = (event.target as HTMLElement).getBoundingClientRect()
        const coordinates: Coordinates = {
          top: (event.clientY - rect.top) / rect.height,
          left: (event.clientX - rect.left) / rect.width,
        }

        positionY = coordinates.left * (depth * 2) - depth
        positionX = coordinates.top * (depth * 2) - depth
        hovered.style.setProperty('--rotate-y', `${-positionY}deg`)
        hovered.style.setProperty('--rotate-x', `${positionX}deg`)
      }) as EventListener)

      hovered.addEventListener('mouseleave', ((): void => {
        hovered.style.setProperty('--rotate-y', '0')
        hovered.style.setProperty('--rotate-x', '0')
      }) as EventListener)
    })
  })
}
