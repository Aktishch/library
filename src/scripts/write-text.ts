import { Container, getData } from '@utils'

const DATA_TEXT = getData('text')

export default (container: Container = document) => {
  const texts = container.querySelectorAll<HTMLElement>(`*[${DATA_TEXT}]`)

  if (!texts.length) return

  const observer: IntersectionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const text = entry.target as HTMLElement
          const value = text.dataset.text

          if (!value) return

          const speed = Number(text.dataset.speed) || 100
          const letters = value.split('')

          observer.unobserve(text)

          const interval = setInterval(() => {
            if (!letters.length) {
              return clearInterval(interval)
            }

            text.innerHTML += letters.shift()
          }, speed)
        }
      })
    },
    {
      root: container === document ? null : container,
      rootMargin: '0px',
      threshold: 0.1
    }
  )

  texts.forEach((text) => {
    observer.observe(text)
  })
}
