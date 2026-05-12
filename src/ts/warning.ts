import { dialog } from '@ts/fancybox'

export default (): void => {
  if (sessionStorage.getItem('warning') !== 'positive')
    setTimeout((): void => dialog.notClosing('/dialogs/dialog-warning.html'), 2000)

  document.addEventListener('click', ((event: Event): void => {
    const button = event.target as HTMLButtonElement

    if (button.hasAttribute('data-warning')) {
      const value: string | undefined = button.dataset.warning

      if (value && value === 'positive') {
        sessionStorage.setItem('warning', value)
        dialog.close()
      } else {
        const currentTab: Window | null = window.open('', '_self')

        setTimeout((): void => {
          ;(document.documentElement as HTMLHtmlElement).innerHTML = ''

          if (currentTab) currentTab.close()
        }, 1000)
      }
    }
  }) as EventListener)
}
