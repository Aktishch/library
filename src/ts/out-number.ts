const outNumber = (): void => {
  const items = document.querySelectorAll('*[data-number]') as NodeListOf<HTMLSpanElement>

  if (items.length !== 0) {
    items.forEach((item: HTMLSpanElement): void => {
      if (!item) return

      const number: number = Number(item.dataset.number)
      const step: number = Number(item.dataset.numberStep) || 0.5
      const time: number = Number(item.dataset.numberTime) * 1000 || 1000
      const fixed: number = Number(item.dataset.numberFixed) || 0
      const timer: number = Math.round(time / (number / step))
      let sum: number = 0

      if (window.screen.height >= item.getBoundingClientRect().top) {
        const interval = setInterval((): void => {
          sum += step

          if (sum >= number) {
            item.innerHTML = String(number.toFixed(fixed))
            clearInterval(interval)
          } else {
            item.innerHTML = String(sum.toFixed(fixed))
          }
        }, timer)

        item.removeAttribute('data-number')
      }
    })
  } else {
    document.removeEventListener('scroll', outNumber as EventListener)
  }
}

export default (): void => document.addEventListener('scroll', outNumber as EventListener, { passive: true })
