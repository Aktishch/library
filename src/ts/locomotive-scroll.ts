import { getTouchDevice, html } from '@utils'
import LocomotiveScroll from 'locomotive-scroll'

export default (): void => {
  if (getTouchDevice()) return

  new LocomotiveScroll({
    lenisOptions: {
      wrapper: window,
      content: html,
      lerp: 0.5,
      duration: 3,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      infinite: false
    }
  })
}
