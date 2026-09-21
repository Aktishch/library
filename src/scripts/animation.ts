import { Container } from '@utils'

const REPEAT_ANIMATION = true
const SHOW_VALUE = 'show'

export default (container: Container = document) => {
  const items = container.querySelectorAll<HTMLElement>('*[data-anim]')

  if (!items.length) return

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        const item = entry.target as HTMLElement

        if (entry.isIntersecting) {
          item.dataset.anim = SHOW_VALUE

          if (!REPEAT_ANIMATION) {
            observer.unobserve(item)
          }
        } else {
          if (REPEAT_ANIMATION) {
            item.dataset.anim = ''
          }
        }
      })

      if (!REPEAT_ANIMATION) {
        const allShow = ([...items] as HTMLElement[]).every((item) => {
          return item.dataset.anim === SHOW_VALUE
        })

        if (allShow) {
          observer.disconnect()
        }
      }
    },
    {
      root: container === document ? null : container,
      rootMargin: '0px',
      threshold: 0
    }
  )

  items.forEach((item) => {
    observer.observe(item)
  })
}
