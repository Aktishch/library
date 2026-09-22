import { Container, getData } from '@utils'

const DATA_NUMBER = getData('number')

export default (container: Container = document) => {
  const items = container.querySelectorAll<HTMLSpanElement>(`*[${DATA_NUMBER}]`)

  if (!items.length) return

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const item = entry.target as HTMLSpanElement
          const value = item.dataset.number

          if (!value) return

          const number = Number(value)
          const step = Number(item.dataset.step) || 0.5
          const time = Number(item.dataset.time) * 1000 || 1000
          const fixed = Number(item.dataset.fixed) || 0
          const iterations = number / step
          const timer = iterations > 0 ? Math.max(Math.round(time / iterations), 1) : 10
          let sum = 0

          observer.unobserve(item)

          const interval = setInterval(() => {
            sum += step

            if (sum >= number) {
              item.innerHTML = number.toFixed(fixed)
              clearInterval(interval)
            } else {
              item.innerHTML = sum.toFixed(fixed)
            }
          }, timer)
        }
      })
    },
    {
      root: container === document ? null : container,
      rootMargin: '0px',
      threshold: 0.1
    }
  )

  items.forEach((item) => {
    observer.observe(item)
  })
}
