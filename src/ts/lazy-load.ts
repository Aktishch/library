import LazyLoad, { ILazyLoadInstance } from 'vanilla-lazyload'

declare global {
  interface Window {
    LazyLoad: typeof LazyLoad
  }
}

window.LazyLoad = LazyLoad

export default (): ILazyLoadInstance => {
  return new window.LazyLoad({
    elements_selector: '*[data-lazy]',
    callback_loaded: (element: HTMLElement): void => {
      const media = element.closest('[data-media]') as HTMLElement

      if (!media) return

      const loader = media.querySelector('*[data-loader]') as HTMLDivElement

      if (loader) loader.remove()
    },
  })
}
