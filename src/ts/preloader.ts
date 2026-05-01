type Resolve = (value: void | PromiseLike<void>) => void

const removePreloader = (ms: number): Promise<void> => {
  return new Promise((resolve: Resolve): NodeJS.Timeout => {
    return setTimeout(resolve, ms)
  })
}

export default async (): Promise<void> => {
  const preloader = document.querySelector('*[data-preloader]') as HTMLDivElement

  if (!preloader) return

  const loadTime: number = window.performance.now() / 2

  preloader.style.transitionDuration = `${loadTime}ms`
  preloader.classList.add('invisible', 'opacity-0')

  await removePreloader(loadTime).finally((): void => preloader.remove())
}
