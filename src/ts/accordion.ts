import { Container, getData, isEn, logError, TimeOut } from '@utils'

type Toggle = HTMLButtonElement | null
type Content = HTMLDivElement | null
type Item = HTMLButtonElement | HTMLAnchorElement

const DATA_ACCORDION: string = getData('accordion')
const DATA_CLOSE: string = getData('close')
const OVERFLOW_CLASSNAME: string = 'overflow-hidden'
const ACTIVE_VALUE: string = 'active'

const handleContentError = (): void => {
  logError(
    isEn
      ? `The ${DATA_ACCORDION} does not have a ${DATA_ACCORDION}-content child element`
      : `У ${DATA_ACCORDION} отсутствует дочерний элемент ${DATA_ACCORDION}-content`
  )
}

export default (container: Container = document): void => {
  const accordions: NodeListOf<HTMLDivElement> = container.querySelectorAll(`*[${DATA_ACCORDION}]`)

  if (!accordions.length) return

  accordions.forEach((accordion: HTMLDivElement): void => {
    const toggle: Toggle = accordion.querySelector(`*[${DATA_ACCORDION}-toggle]`)
    const content: Content = accordion.querySelector(`*[${DATA_ACCORDION}-content]`)
    const items: NodeListOf<Item> = accordion.querySelectorAll(`*[${DATA_ACCORDION}-item]`)
    let timeOut: TimeOut

    const setHeightContent = (duration: boolean = true): void => {
      if (!content) {
        return handleContentError()
      }

      if (timeOut) {
        clearTimeout(timeOut)
      }

      const scrollHeight: number = content.scrollHeight
      const transitionDuration: number = duration ? Math.max(scrollHeight / 2, 150) : 0

      content.style.height = `${scrollHeight}px`
      content.style.transitionDuration = `${transitionDuration}ms`

      if (accordion.dataset.accordion === ACTIVE_VALUE) {
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

    const onClickToggle = (): void => {
      accordion.dataset.accordion = accordion.dataset.accordion === ACTIVE_VALUE ? '' : ACTIVE_VALUE
      setHeightContent()
    }

    const closeOnClick = (event: Event): void => {
      if (
        (event.target as HTMLElement).closest(`[${DATA_CLOSE}-click]`) !== accordion &&
        accordion.dataset.accordion === ACTIVE_VALUE &&
        accordion.hasAttribute(`${DATA_CLOSE}-click`)
      ) {
        closeContent()
      }
    }

    const closeOnScroll = (): void => {
      if (accordion.hasAttribute(`${DATA_CLOSE}-scroll`) && accordion.dataset.accordion === ACTIVE_VALUE) {
        closeContent()
      }
    }

    toggle?.classList.add('cursor-pointer')
    setHeightContent(false)

    if (content) {
      content.style.transitionProperty = 'height'
    }

    if (items.length) {
      items.forEach((item: Item): void => {
        item.addEventListener('click', closeContent as EventListener)
      })
    }

    toggle?.addEventListener('click', onClickToggle as EventListener)
    container.addEventListener('click', closeOnClick as EventListener)
    container.addEventListener('scroll', closeOnScroll as EventListener, { passive: true })
  })
}
