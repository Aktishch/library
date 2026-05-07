export default (): void => {
  document.addEventListener('click', ((event: Event): void => {
    const toggle = event.target as HTMLButtonElement

    if (toggle.closest('[data-inverted-toggle]')) {
      const value: string | undefined = toggle.dataset.invertedToggle

      if (!value) return

      const inverted = toggle.closest('[data-inverted]') as HTMLDivElement

      inverted.dataset.inverted = value
    }
  }) as EventListener)
}
