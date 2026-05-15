import { getTouchDevice, html } from '@utils'
import LocomotiveScroll from 'locomotive-scroll'

declare global {
  interface Window {
    LocomotiveScroll: typeof LocomotiveScroll
  }
}

window.LocomotiveScroll = LocomotiveScroll

export default (): void => {
  if (getTouchDevice()) return

  new window.LocomotiveScroll({
    lenisOptions: {
      wrapper: window,
      content: html,
      lerp: 0.5,
      duration: 3,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      infinite: false,
    },
  })
}
