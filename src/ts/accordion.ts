type AccordionItem = HTMLButtonElement | HTMLAnchorElement

const className: string[] = ['overflow-hidden']

const createAccordion = (accordion: HTMLDivElement): void => {
  const toggle = accordion.querySelector('*[data-accordion-toggle]') as HTMLDivElement | HTMLButtonElement
  const content = accordion.querySelector('*[data-accordion-content]') as HTMLDivElement
  const items = accordion.querySelectorAll('*[data-accordion-item]') as NodeListOf<AccordionItem>
  let timeOut: NodeJS.Timeout

  const setAccordionHeight = (duration = true): void => {
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

  if (accordion.hasAttribute('data-close-click')) {
    document.addEventListener('click', ((event: Event): void => {
      if (
        (event.target as HTMLElement).closest('[data-close-click]') !== accordion &&
        accordion.dataset.accordion === 'active'
      )
        accordionClose()
    }) as EventListener)
  }

  if (accordion.hasAttribute('data-close-scroll')) {
    document.addEventListener('scroll', ((): void => {
      if (accordion.dataset.accordion === 'active') accordionClose()
    }) as EventListener)
  }
}

export default (): void => {
  const accordions = document.querySelectorAll('*[data-accordion]') as NodeListOf<HTMLDivElement>

  accordions.forEach((accordion: HTMLDivElement): void => {
    if (accordion) createAccordion(accordion)
  })
}
