const setWriteText = (section: HTMLElement): void => {
  const record = section.querySelector('*[data-record]') as HTMLElement

  if (!record) return

  const text: string = String(record.dataset.record)
  const speed: string | undefined = record.dataset.recordSpeed
  const letters: string[] = [text].join('').split('')

  const interval = setInterval(
    (): void => {
      if (!letters[0]) return clearInterval(interval)
      record.innerHTML += letters.shift()
    },
    Number(speed) | 100
  )
}

const scrollToText = (): void => {
  const section = document.querySelector('*[data-section]') as HTMLElement

  if (section && window.screen.height >= section.getBoundingClientRect().top) {
    setWriteText(section)
    document.removeEventListener('scroll', scrollToText as EventListener)
  }
}

export default (): void => document.addEventListener('scroll', scrollToText as EventListener)
