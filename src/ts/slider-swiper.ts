import { media } from '@plugins'
import { checkQuizSlide } from '@ts/quiz'
import { Container, getData, isEn, logError } from '@utils'
import Swiper from 'swiper'
import { Autoplay, EffectCoverflow, Grid, Navigation, Pagination, Scrollbar, Thumbs } from 'swiper/modules'

type SliderItem = HTMLDivElement | null
type SliderBuilt = Swiper | undefined
type Button = HTMLButtonElement | null
type Value = string | undefined

Swiper.use([Autoplay, EffectCoverflow, Grid, Navigation, Pagination, Scrollbar, Thumbs])
Swiper.defaults.touchStartPreventDefault = false

const DATA_SLIDER: string = getData('slider')
const DATA_QUIZ: string = getData('quiz')
const { sm, md, lg, xl } = media

const handleValueError = (value: string): void => {
  logError(
    isEn
      ? `The ${DATA_SLIDER}="${value}" does not have a ${DATA_SLIDER}-swiper="${value}" child element`
      : `У ${DATA_SLIDER}="${value}" отсутствует дочерний элемент ${DATA_SLIDER}-swiper="${value}"`
  )
}

const initGallerySlider = (container: Container): void => {
  const slider: SliderItem = container.querySelector(`*[${DATA_SLIDER}="gallery"]`)

  if (!slider) return

  const value: Value = slider.dataset.slider

  if (!value) return

  const swiper: SliderItem = slider.querySelector(`*[${DATA_SLIDER}-swiper="${value}"]`)

  if (!swiper) {
    handleValueError(value)
    return
  }

  const pagination: SliderItem = slider.querySelector(`*[${DATA_SLIDER}-pagination="${value}"]`)
  const prev: Button = slider.querySelector(`*[${DATA_SLIDER}-prev="${value}"]`)
  const next: Button = slider.querySelector(`*[${DATA_SLIDER}-next="${value}"]`)

  new Swiper(swiper, {
    pagination: {
      el: pagination,
      clickable: true
    },
    navigation: {
      prevEl: prev,
      nextEl: next
    },
    effect: 'coverflow',
    slidesPerView: 1.3,
    spaceBetween: 16,
    grabCursor: true,
    watchSlidesProgress: true,
    loop: true,
    freeMode: true,
    breakpoints: {
      [sm]: {
        slidesPerView: 2
      },
      [lg]: {
        slidesPerView: 3
      }
    },
    autoplay: {
      delay: 3000,
      stopOnLastSlide: false,
      disableOnInteraction: false
    }
  })
}

const initProductsSlider = (container: Container): void => {
  const slider: SliderItem = container.querySelector(`*[${DATA_SLIDER}="products"]`)

  if (!slider) return

  const value: Value = slider.dataset.slider

  if (!value) return

  const swiper: SliderItem = slider.querySelector(`*[${DATA_SLIDER}-swiper="${value}"]`)

  if (!swiper) {
    handleValueError(value)
    return
  }

  const pagination: SliderItem = slider.querySelector(`*[${DATA_SLIDER}-pagination="${value}"]`)
  const prev: Button = slider.querySelector(`*[${DATA_SLIDER}-prev="${value}"]`)
  const next: Button = slider.querySelector(`*[${DATA_SLIDER}-next="${value}"]`)

  new Swiper(swiper, {
    pagination: {
      el: pagination,
      clickable: true
    },
    navigation: {
      prevEl: prev,
      nextEl: next
    },
    slidesPerView: 1.3,
    slidesPerGroup: 1,
    spaceBetween: 16,
    grabCursor: true,
    watchSlidesProgress: true,
    breakpoints: {
      [sm]: {
        slidesPerView: 2
      },
      [lg]: {
        slidesPerView: 3
      },
      [xl]: {
        slidesPerView: 4
      }
    }
  })
}

const initQuizSlider = (container: Container): void => {
  const slider: SliderItem = container.querySelector(`*[${DATA_SLIDER}="quiz"]`)

  if (!slider) return

  const value: Value = slider.dataset.slider

  if (!value) return

  const swiper: SliderItem = slider.querySelector(`*[${DATA_SLIDER}-swiper="${value}"]`)

  if (!swiper) {
    handleValueError(value)
    return
  }

  const pagination: SliderItem = slider.querySelector(`*[${DATA_SLIDER}-pagination="${value}"]`)
  const prev: Button = slider.querySelector(`*[${DATA_SLIDER}-prev="${value}"]`)
  const next: Button = slider.querySelector(`*[${DATA_SLIDER}-next="${value}"]`)

  const checkSwiperSlide = (swiper: Swiper): void => {
    const quiz: SliderItem = swiper.el.closest(`[${DATA_QUIZ}]`)

    if (!quiz) return

    const visibleSlide: SliderItem = quiz.querySelector('.swiper-slide-visible')

    if (visibleSlide) {
      checkQuizSlide(visibleSlide)

      if (visibleSlide === swiper.slides[swiper.slides.length - 1]) {
        quiz.setAttribute(`${DATA_QUIZ}-end`, '')
      } else {
        quiz.removeAttribute(`${DATA_QUIZ}-end`)
      }
    }
  }

  new Swiper(swiper, {
    pagination: {
      el: pagination,
      type: 'custom',
      renderCustom: (...[, current, total]: [Swiper, number, number]): string => {
        return String(total - current)
      }
    },
    navigation: {
      prevEl: prev,
      nextEl: next
    },
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 16,
    allowTouchMove: false,
    watchSlidesProgress: true,
    on: {
      init: (swiper: Swiper): void => {
        checkSwiperSlide(swiper)
      },
      slideChange: (swiper: Swiper): void => {
        checkSwiperSlide(swiper)
      }
    }
  })
}

const initThumbsSlider = (container: Container): SliderBuilt => {
  const slider: SliderItem = container.querySelector(`*[${DATA_SLIDER}="thumbs"]`)

  if (!slider) return

  const value: Value = slider.dataset.slider

  if (!value) return

  const swiper: SliderItem = slider.querySelector(`*[${DATA_SLIDER}-swiper="${value}"]`)

  if (!swiper) {
    handleValueError(value)
    return
  }

  return new Swiper(swiper, {
    slidesPerView: 3,
    slidesPerGroup: 1,
    spaceBetween: 16,
    speed: 1000,
    grabCursor: true,
    breakpoints: {
      [md]: {
        slidesPerView: 4
      }
    }
  })
}

const initBgSlider = (container: Container): SliderBuilt => {
  const slider: SliderItem = container.querySelector(`*[${DATA_SLIDER}="bg"]`)

  if (!slider) return

  const value: Value = slider.dataset.slider

  if (!value) return

  const swiper: SliderItem = slider.querySelector(`*[${DATA_SLIDER}-swiper="${value}"]`)

  if (!swiper) {
    handleValueError(value)
    return
  }

  return new Swiper(swiper, {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 16,
    speed: 1000,
    allowTouchMove: false
  })
}

const initDescriptionSlider = (container: Container): void => {
  const description = container.querySelector('*[data-description]') as HTMLElement

  if (!description) return

  const slider: SliderItem = description.querySelector(`*[${DATA_SLIDER}="description"]`)

  if (!slider) return

  const value: Value = slider.dataset.slider

  if (!value) return

  const swiper: SliderItem = slider.querySelector(`*[${DATA_SLIDER}-swiper="${value}"]`)

  if (!swiper) {
    handleValueError(value)
    return
  }

  const thumbs: SliderBuilt = initThumbsSlider(description)
  const bg: SliderBuilt = initBgSlider(description)

  new Swiper(swiper, {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 16,
    speed: 1000,
    grabCursor: true,
    thumbs: {
      swiper: thumbs
    },
    on: {
      slideChange: (swiper: Swiper): void => {
        if (!bg) return

        bg.slideTo(swiper.activeIndex)
      }
    }
  })
}

export default (container: Container = document): void => {
  initGallerySlider(container)
  initProductsSlider(container)
  initQuizSlider(container)
  initDescriptionSlider(container)
}
