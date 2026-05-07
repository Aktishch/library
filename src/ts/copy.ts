const className: string[] = ['invisible', 'opacity-0']

export default (): void => {
  document.addEventListener('click', ((event: Event): void => {
    const button = event.target as HTMLButtonElement

    if (button.closest('[data-copy-button]')) {
      const copy = button.closest('[data-copy]') as HTMLDivElement
      const result = copy.querySelector('[data-copy-result]') as HTMLSpanElement

      if (!copy.dataset.copy) return

      button.disabled = true
      window.navigator.clipboard.writeText(copy.dataset.copy)
      result.classList.remove(...className)

      setTimeout((): void => {
        button.disabled = false
        result.classList.add(...className)
      }, 1000)
    }
  }) as EventListener)
}
