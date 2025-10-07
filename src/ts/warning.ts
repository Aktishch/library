import { dialog } from './fancybox'

export default (): void => {
  if (sessionStorage.getItem('warning') !== 'positive')
    setTimeout((): void => dialog.notClosing('/dialogs/dialog-warning.html'), 2000)

  document.addEventListener('click', ((event: Event): void => {
    if ((event.target as HTMLButtonElement).hasAttribute('data-positive')) {
      sessionStorage.setItem('warning', 'positive')
      dialog.close()
    }
  }) as EventListener)

  document.addEventListener('click', ((event: Event): void => {
    if ((event.target as HTMLButtonElement).hasAttribute('data-negative')) {
      const currentTab = window.open('', '_self') as Window

      currentTab.document.write('')
      setTimeout((): void => currentTab.close(), 1000)
    }
  }) as EventListener)
}
