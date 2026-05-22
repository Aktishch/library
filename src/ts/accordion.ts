import { Container } from '@utils'

type AccordionElement = HTMLButtonElement | HTMLAnchorElement

const DATA_ACCORDION: string = 'data-accordion'
const DATA_CLOSE: string = 'data-close'
const OVERFLOW_CLASSNAME: string = 'overflow-hidden'

export default (container: Container = document): void => {
  const accordions = container.querySelectorAll(`*[${DATA_ACCORDION}]`) as NodeListOf<HTMLDivElement>

  if (!accordions.length) return

  accordions.forEach((accordion: HTMLDivElement): void => {
    const toggle = accordion.querySelector(`*[${DATA_ACCORDION}-toggle]`) as HTMLDivElement | HTMLButtonElement
    const content = accordion.querySelector(`*[${DATA_ACCORDION}-content]`) as HTMLDivElement
    const items = accordion.querySelectorAll(`*[${DATA_ACCORDION}-item]`) as NodeListOf<AccordionElement>
    let timeOut: NodeJS.Timeout | undefined

    const setHeightContent = (duration: boolean = true): void => {
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
    }

    const closeContent = (): void => {
      accordion.dataset.accordion = ''
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

    toggle.classList.add('cursor-pointer')
    content.style.transitionProperty = 'height'
    setHeightContent(false)

    toggle.addEventListener('click', ((): void => {
      accordion.dataset.accordion = accordion.dataset.accordion === 'active' ? '' : 'active'
      setHeightContent()
    }) as EventListener)

    items.forEach((item: AccordionElement): void => {
      if (!item) return

      item.addEventListener('click', closeContent as EventListener)
    })

    container.addEventListener('click', closeOnClick as EventListener)
    container.addEventListener('scroll', closeOnScroll as EventListener, { passive: true })
  })
}
