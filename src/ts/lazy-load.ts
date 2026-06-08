import LazyLoad, { ILazyLoadInstance } from 'vanilla-lazyload'

type LazyElement = HTMLImageElement | HTMLPictureElement | HTMLVideoElement | HTMLSourceElement | HTMLIFrameElement
type Media = HTMLElement | null
type Loader = HTMLDivElement | null

export default (): ILazyLoadInstance => {
  return new LazyLoad({
    elements_selector: '*[data-lazy]',
    callback_loaded: (item: LazyElement): void => {
      const media: Media = item.closest('[data-media]')

      if (!media) return

      const loader: Loader = media.querySelector('*[data-loader]')

      if (loader) {
        loader.remove()
      }
    }
  })
}
