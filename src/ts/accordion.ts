import { Container, getData, isEn, logError } from '@utils'

type AccordionElement = HTMLButtonElement | HTMLAnchorElement

const DATA_ACCORDION: string = getData('accordion')
const DATA_CLOSE: string = 'data-close'
const OVERFLOW_CLASSNAME: string = 'overflow-hidden'

export default (container: Container = document): void => {
  const accordions: NodeListOf<HTMLDivElement> = container.querySelectorAll(`*[${DATA_ACCORDION}]`)

  if (!accordions.length) return

  accordions.forEach((accordion: HTMLDivElement): void => {
    const toggle: HTMLButtonElement | null = accordion.querySelector(`*[${DATA_ACCORDION}-toggle]`)
    const content: HTMLDivElement | null = accordion.querySelector(`*[${DATA_ACCORDION}-content]`)
    const items: NodeListOf<AccordionElement> = accordion.querySelectorAll(`*[${DATA_ACCORDION}-item]`)
    let timeOut: NodeJS.Timeout | undefined

    const setHeightContent = (duration: boolean = true): void => {
      if (content) {
        if (timeOut) {
          clearTimeout(timeOut)
        }

        const scrollHeight: number = content.scrollHeight
        const transitionDuration: number = duration ? Math.max(scrollHeight / 2, 150) : 0

        content.style.height = `${scrollHeight}px`
        content.style.transitionDuration = `${transitionDuration}ms`

        if (accordion.dataset.accordion === 'active') {
          timeOut = setTimeout((): void => {
            content.style.height = ''
            content.classList.remove(OVERFLOW_CLASSNAME)
          }, transitionDuration)
        } else {
          content.classList.add(OVERFLOW_CLASSNAME)
          void content.offsetHeight
          content.style.height = '0'
          timeOut = undefined
        }
      } else {
        logError(
          isEn
            ? `The ${DATA_ACCORDION} does not have a ${DATA_ACCORDION}-content child element`
            : `У ${DATA_ACCORDION} отсутствует дочерний элемент ${DATA_ACCORDION}-content`
        )
      }
    }

    const closeContent = (): void => {
      accordion.dataset.accordion = ''
      setHeightContent()
    }

    const onClickToggle = (): void => {
      accordion.dataset.accordion = accordion.dataset.accordion === 'active' ? '' : 'active'
      setHeightContent()
    }

    const closeOnClick = (event: Event): void => {
      if (
        (event.target as HTMLElement).closest(`[${DATA_CLOSE}-click]`) !== accordion &&
        accordion.dataset.accordion === 'active' &&
        accordion.hasAttribute(`${DATA_CLOSE}-click`)
      ) {
        closeContent()
      }
    }

    const closeOnScroll = (): void => {
      if (accordion.hasAttribute(`${DATA_CLOSE}-scroll`) && accordion.dataset.accordion === 'active') {
        closeContent()
      }
    }

    toggle?.classList.add('cursor-pointer')
    setHeightContent(false)

    if (content) {
      content.style.transitionProperty = 'height'
    }

    items.forEach((item: AccordionElement): void => {
      if (!item) return

      item.addEventListener('click', closeContent)
    })

    toggle?.addEventListener('click', onClickToggle)
    container.addEventListener('click', closeOnClick)
    container.addEventListener('scroll', closeOnScroll, { passive: true })
  })
}
