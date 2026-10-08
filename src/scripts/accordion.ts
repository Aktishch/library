import { getData, isEn, logError } from '@utils'

const DATA_ACCORDION = getData('accordion')
const DATA_CLOSE = getData('close')
const DATA_AUTO = getData('auto')
const ACTIVE_VALUE = 'active'
const OVERFLOW_CLASSNAME = 'overflow-hidden'
const CURSOR_CLASSNAME = 'cursor-pointer'

export default (container: Document | HTMLElement = document) => {
  const accordions = container.querySelectorAll<HTMLDivElement>(`*[${DATA_ACCORDION}]`)

  if (!accordions.length) return

  accordions.forEach((accordion) => {
    const toggle: HTMLButtonElement | null = accordion.querySelector(`*[${DATA_ACCORDION}-toggle]`)
    const content: HTMLDivElement | null = accordion.querySelector(`*[${DATA_ACCORDION}-content]`)
    const items = accordion.querySelectorAll<HTMLButtonElement | HTMLAnchorElement>(`*[${DATA_ACCORDION}-item]`)

    const setHeightContent = (transition = true) => {
      if (!content) {
        logError(
          isEn
            ? `The ${DATA_ACCORDION} does not have a ${DATA_ACCORDION}-content child element`
            : `У ${DATA_ACCORDION} отсутствует дочерний элемент ${DATA_ACCORDION}-content`
        )
        return
      }

      if (!accordion.hasAttribute(DATA_AUTO)) {
        const duration = transition ? Math.max(content.scrollHeight / 2, 150) : 0

        content.style.transitionDuration = `${duration}ms`

        if (accordion.dataset.accordion === ACTIVE_VALUE) {
          content.style.removeProperty('height')
        } else {
          content.style.height = '0'
        }
      }
    }

    const closeContent = () => {
      accordion.dataset.accordion = ''
      setHeightContent()
    }

    const onClickToggle = () => {
      accordion.dataset.accordion = accordion.dataset.accordion === ACTIVE_VALUE ? '' : ACTIVE_VALUE
      setHeightContent()
    }

    const closeOnClick = (event: Event) => {
      if (
        (event.target as HTMLElement).closest(`[${DATA_CLOSE}-click]`) !== accordion &&
        accordion.dataset.accordion === ACTIVE_VALUE &&
        accordion.hasAttribute(`${DATA_CLOSE}-click`)
      ) {
        closeContent()
      }
    }

    const closeOnScroll = () => {
      if (accordion.hasAttribute(`${DATA_CLOSE}-scroll`) && accordion.dataset.accordion === ACTIVE_VALUE) {
        closeContent()
      }
    }

    if (!accordion.hasAttribute(DATA_AUTO) && content) {
      content.classList.add(OVERFLOW_CLASSNAME)
    }

    toggle?.classList.add(CURSOR_CLASSNAME)
    setHeightContent(false)

    if (items.length) {
      items.forEach((item) => {
        item.addEventListener('click', closeContent)
      })
    }

    toggle?.addEventListener('click', onClickToggle)
    container.addEventListener('click', closeOnClick)
    container.addEventListener('scroll', closeOnScroll, { passive: true })
  })
}
