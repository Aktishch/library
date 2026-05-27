import { Container, Coordinates, getData, getTouchDevice } from '@utils'

const DATA_PARALLAX: string = getData('parallax')

export default (container: Container = document): void => {
  if (getTouchDevice()) return

  const parallaxes: NodeListOf<HTMLElement> = container.querySelectorAll(`*[${DATA_PARALLAX}]`)

  if (!parallaxes.length) return

  parallaxes.forEach((parallax: HTMLElement): void => {
    const layers: NodeListOf<HTMLElement> = parallax.querySelectorAll(`*[${DATA_PARALLAX}-layer]`)
    const hovereds: NodeListOf<HTMLElement> = parallax.querySelectorAll(`*[${DATA_PARALLAX}-hovered]`)

    if (layers.length) {
      const coordinates: Coordinates = {
        top: 0,
        left: 0
      }
      let isMoving: boolean = false

      const updateLayers = (): void => {
        let hasChanges = false

        layers.forEach((layer: HTMLElement): void => {
          if (!layer) return

          const speed: number = Number(layer.dataset.parallaxSpeed) / 100 || 0.05
          const depth: number = Number(layer.dataset.parallaxDepth) || 1
          const reverse: number = layer.dataset.parallaxLayer === 'reverse' ? -1 : 1
          let positionY: number = Number(layer.dataset.posY) || 0
          let positionX: number = Number(layer.dataset.posX) || 0
          const initialY: number = coordinates.top - positionY
          const initialX: number = coordinates.left - positionX

          if (Math.abs(initialY) > 0.01 || Math.abs(initialX) > 0.01) {
            positionY += initialY * speed
            positionX += initialX * speed
            layer.dataset.posY = positionY.toString()
            layer.dataset.posX = positionX.toString()
            layer.style.transform = `translate(${(positionX / depth) * reverse}%, ${(positionY / depth) * reverse}%)`
            hasChanges = true
          }
        })

        if (hasChanges) {
          window.requestAnimationFrame(updateLayers)
        } else {
          isMoving = false
        }
      }

      const onMouseMove = (event: MouseEvent): void => {
        const height: number = parallax.offsetHeight
        const width: number = parallax.offsetWidth

        coordinates.top = ((event.clientY - height / 2) / height) * 100
        coordinates.left = ((event.clientX - width / 2) / width) * 100

        if (!isMoving) {
          isMoving = true
          window.requestAnimationFrame(updateLayers)
        }
      }

      parallax.addEventListener('mousemove', onMouseMove as EventListener)
    }

    hovereds.forEach((hovered: HTMLElement): void => {
      if (!hovered) return

      const items: NodeListOf<HTMLElement> = hovered.querySelectorAll(`*[${DATA_PARALLAX}-item]`)
      const perspective: number = Number(hovered.dataset.parallaxHovered) || 600
      const depth: number = 10
      const coordinates: Coordinates = {
        top: 0,
        left: 0
      }

      const onMouseMove = (event: MouseEvent): void => {
        const { top, left, width, height } = (event.target as HTMLElement).getBoundingClientRect()

        coordinates.top = ((event.clientX - left) / width) * (depth * 2) - depth
        coordinates.left = ((event.clientY - top) / height) * (depth * 2) - depth
        hovered.style.setProperty('--rotate-y', `${-coordinates.top}deg`)
        hovered.style.setProperty('--rotate-x', `${coordinates.left}deg`)
      }

      const onMouseLeave = (): void => {
        hovered.style.setProperty('--rotate-y', '0')
        hovered.style.setProperty('--rotate-x', '0')
      }

      hovered.style.perspective = `${perspective}px`

      items.forEach((item: HTMLElement): void => {
        if (!item) return

        const translateZ: number = Number(item.dataset.parallaxItem) || 100

        item.style.transform = `rotateX(var(--rotate-x)) rotateY(var(--rotate-y)) translateZ(${translateZ}px)`
      })

      hovered.addEventListener('mousemove', onMouseMove as EventListener)
      hovered.addEventListener('mouseleave', onMouseLeave as EventListener)
    })
  })
}
