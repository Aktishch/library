import { Container } from '@utils'

interface CreateAccordion {
  accordion: HTMLDivElement
  container: Container
}

type AccordionItem = HTMLButtonElement | HTMLAnchorElement

const className: string[] = ['overflow-hidden']

const createAccordion = ({ accordion, container }: CreateAccordion): void => {
  const toggle = accordion.querySelector('*[data-accordion-toggle]') as HTMLDivElement | HTMLButtonElement
  const content = accordion.querySelector('*[data-accordion-content]') as HTMLDivElement
  const items = accordion.querySelectorAll('*[data-accordion-item]') as NodeListOf<AccordionItem>
  let timeOut: NodeJS.Timeout

  const setAccordionHeight = (duration: boolean = true): void => {
    if (timeOut) clearTimeout(timeOut)

    const scrollHeight: number = content.scrollHeight
    const transitionDuration: number = duration ? Math.max(scrollHeight / 2, 100) : 0

    content.style.height = `${scrollHeight}px`
    content.style.transitionDuration = `${transitionDuration}ms`

    timeOut = setTimeout((): void => {
      if (accordion.dataset.accordion === 'active') {
        content.style.height = ''
        content.classList.remove(...className)
      } else {
        content.style.height = '0'
        content.classList.add(...className)
      }
    }, transitionDuration)
  }

  const accordionClose = (): void => {
    accordion.dataset.accordion = ''
    setAccordionHeight()
  }

  toggle.classList.add('cursor-pointer')
  content.style.transitionProperty = 'height'
  setAccordionHeight(false)

  toggle.addEventListener('click', ((): void => {
    accordion.dataset.accordion = accordion.dataset.accordion === 'active' ? '' : 'active'
    setAccordionHeight()
  }) as EventListener)

  items.forEach((item: AccordionItem): void => {
    if (item) item.addEventListener('click', accordionClose as EventListener)
  })

  container.addEventListener('click', ((event: Event): void => {
    if (
      (event.target as HTMLElement).closest('[data-close-click]') !== accordion &&
      accordion.dataset.accordion === 'active' &&
      accordion.hasAttribute('data-close-click')
    )
      accordionClose()
  }) as EventListener)

  container.addEventListener(
    'scroll',
    ((): void => {
      if (accordion.hasAttribute('data-close-scroll') && accordion.dataset.accordion === 'active') accordionClose()
    }) as EventListener,
    { passive: true }
  )
}

export default (container: Container = document): void => {
  const accordions = container.querySelectorAll('*[data-accordion]') as NodeListOf<HTMLDivElement>

  accordions.forEach((accordion: HTMLDivElement): void => {
    if (accordion) createAccordion({ accordion, container })
  })
}
