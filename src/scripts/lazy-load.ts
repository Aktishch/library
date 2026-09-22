import { getData } from '@utils'
import LazyLoad from 'vanilla-lazyload'

const DATA_LAZY = getData('lazy')
const DATA_MEDIA = getData('media')
const DATA_LOADER = getData('loader')

export default () => {
  return new LazyLoad({
    elements_selector: `*[${DATA_LAZY}]`,
    callback_loaded: (item) => {
      const media: HTMLElement | null = item.closest(`[${DATA_MEDIA}]`)

      if (!media) return

      const loader: HTMLDivElement | null = media.querySelector(`*[${DATA_LOADER}]`)

      if (loader) {
        loader.remove()
      }
    }
  })
}
