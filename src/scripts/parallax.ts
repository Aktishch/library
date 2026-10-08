import { getData, getTouchDevice } from '@utils'

const DATA_PARALLAX = getData('parallax')

export default (container: Document | HTMLElement = document) => {
  if (getTouchDevice()) return

  const parallaxes = container.querySelectorAll<HTMLElement>(`*[${DATA_PARALLAX}]`)

  if (!parallaxes.length) return

  parallaxes.forEach((parallax) => {
    const layers = parallax.querySelectorAll<HTMLElement>(`*[${DATA_PARALLAX}-layer]`)
    const hovereds = parallax.querySelectorAll<HTMLElement>(`*[${DATA_PARALLAX}-hovered]`)

    if (layers.length) {
      const coordinates = {
        top: 0,
        left: 0
      }
      let isMoving = false

      const updateLayers = () => {
        let hasChanges = false

        layers.forEach((layer) => {
          const speed = Number(layer.dataset.parallaxSpeed) / 100 || 0.05
          const depth = Number(layer.dataset.parallaxDepth) || 1
          const reverse = layer.dataset.parallaxLayer === 'reverse' ? -1 : 1
          let positionY = Number(layer.dataset.posY) || 0
          let positionX = Number(layer.dataset.posX) || 0
          const initialY = coordinates.top - positionY
          const initialX = coordinates.left - positionX

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

      const onMouseMove = (event: MouseEvent) => {
        const { clientY, clientX } = event
        const { offsetHeight, offsetWidth } = parallax

        coordinates.top = ((clientY - offsetHeight / 2) / offsetHeight) * 100
        coordinates.left = ((clientX - offsetWidth / 2) / offsetWidth) * 100

        if (!isMoving) {
          isMoving = true
          window.requestAnimationFrame(updateLayers)
        }
      }

      parallax.addEventListener('mousemove', onMouseMove)
    }

    if (hovereds.length) {
      hovereds.forEach((hovered) => {
        const items = hovered.querySelectorAll<HTMLElement>(`*[${DATA_PARALLAX}-item]`)
        const perspective = Number(hovered.dataset.parallaxHovered) || 600
        const depth = 10

        const onMouseMove = (event: MouseEvent) => {
          const { clientX, clientY } = event
          const { top, left, width, height } = (event.target as HTMLElement).getBoundingClientRect()

          hovered.style.setProperty('--rotate-y', `${-(((clientX - left) / width) * (depth * 2) - depth)}deg`)
          hovered.style.setProperty('--rotate-x', `${((clientY - top) / height) * (depth * 2) - depth}deg`)
        }

        const onMouseLeave = () => {
          hovered.style.setProperty('--rotate-y', '0')
          hovered.style.setProperty('--rotate-x', '0')
        }

        hovered.style.perspective = `${perspective}px`

        if (items.length) {
          items.forEach((item) => {
            const translateZ = Number(item.dataset.parallaxItem) || 100

            item.style.transform = `rotateX(var(--rotate-x)) rotateY(var(--rotate-y)) translateZ(${translateZ}px)`
          })
        }

        hovered.addEventListener('mousemove', onMouseMove)
        hovered.addEventListener('mouseleave', onMouseLeave)
      })
    }
  })
}
