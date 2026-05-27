import LazyLoad, { ILazyLoadInstance } from 'vanilla-lazyload'

declare global {
  interface Window {
    LazyLoad: typeof LazyLoad
  }
}

type LazyElement = HTMLImageElement | HTMLPictureElement | HTMLVideoElement | HTMLSourceElement | HTMLIFrameElement

window.LazyLoad = LazyLoad

export default (): ILazyLoadInstance => {
  return new window.LazyLoad({
    elements_selector: '*[data-lazy]',
    callback_loaded: (item: LazyElement): void => {
      const media: HTMLElement | null = item.closest('[data-media]')

      if (!media) return

      const loader: HTMLDivElement | null = media.querySelector('*[data-loader]')

      if (loader) {
        loader.remove()
      }
    }
  })
}
