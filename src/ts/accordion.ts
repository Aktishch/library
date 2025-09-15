const createAccordion = (accordion: HTMLDivElement): void => {
  const toggle = accordion.querySelector('*[data-accordion-toggle]') as HTMLDivElement | HTMLButtonElement
  const content = accordion.querySelector('*[data-accordion-content]') as HTMLDivElement
  let timeOut: NodeJS.Timeout

  const setAccordionHeight = (duration = true): void => {
    if (timeOut) clearTimeout(timeOut)

    const scrollHeight: number = content.scrollHeight
    const transitionDuration: number = duration ? Math.max(scrollHeight / 2, 100) : 0

    content.style.height = `${scrollHeight}px`
    content.style.transitionDuration = `${transitionDuration}ms`

    if (accordion.dataset.accordion === 'active') {
      timeOut = setTimeout((): void => {
        content.style.height = ''
        content.classList.remove('overflow-hidden')
      }, transitionDuration)
    } else {
      timeOut = setTimeout((): void => {
        content.style.height = '0'
        content.classList.add('overflow-hidden')
      }, transitionDuration)
    }
  }

  toggle.classList.add('cursor-pointer')
  content.style.transitionProperty = 'height'
  setAccordionHeight(false)

  toggle.addEventListener('click', ((): void => {
    accordion.dataset.accordion = accordion.dataset.accordion === 'active' ? '' : 'active'
    setAccordionHeight()
  }) as EventListener)

  if (accordion.hasAttribute('data-close-click')) {
    document.addEventListener('click', ((event: Event): void => {
      if (
        (event.target as HTMLElement).closest('[data-close-click]') !== accordion &&
        accordion.dataset.accordion === 'active'
      ) {
        accordion.dataset.accordion = ''
        setAccordionHeight()
      }
    }) as EventListener)
  }

  if (accordion.hasAttribute('data-close-scroll')) {
    document.addEventListener('scroll', ((): void => {
      if (accordion.dataset.accordion === 'active') {
        accordion.dataset.accordion = ''
        setAccordionHeight()
      }
    }) as EventListener)
  }
}

export default (): void => {
  const accordions = document.querySelectorAll('*[data-accordion]') as NodeListOf<HTMLDivElement>

  accordions.forEach((accordion: HTMLDivElement): void => {
    if (accordion) createAccordion(accordion)
  })
}
