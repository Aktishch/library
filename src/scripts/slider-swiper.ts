import { checkQuizSlide } from '@scripts/quiz'
import { Container, getData, isEn, logError, media } from '@utils'
import Swiper from 'swiper'
import { Autoplay, EffectCoverflow, Grid, Navigation, Pagination, Scrollbar, Thumbs } from 'swiper/modules'

Swiper.use([Autoplay, EffectCoverflow, Grid, Navigation, Pagination, Scrollbar, Thumbs])
Swiper.defaults.touchStartPreventDefault = false

const DATA_SLIDER = getData('slider')
const DATA_QUIZ = getData('quiz')
const { sm, md, lg, xl } = media

const handleValueError = (value: string) => {
  logError(
    isEn
      ? `The ${DATA_SLIDER}="${value}" does not have a ${DATA_SLIDER}-swiper="${value}" child element`
      : `У ${DATA_SLIDER}="${value}" отсутствует дочерний элемент ${DATA_SLIDER}-swiper="${value}"`
  )
}

const initGallerySlider = (container: Container) => {
  const slider: HTMLDivElement | null = container.querySelector(`*[${DATA_SLIDER}="gallery"]`)

  if (!slider) return

  const value = slider.dataset.slider

  if (!value) return

  const swiper: HTMLDivElement | null = slider.querySelector(`*[${DATA_SLIDER}-swiper="${value}"]`)

  if (!swiper) {
    handleValueError(value)
    return
  }

  const pagination: HTMLDivElement | null = slider.querySelector(`*[${DATA_SLIDER}-pagination="${value}"]`)
  const prev: HTMLButtonElement | null = slider.querySelector(`*[${DATA_SLIDER}-prev="${value}"]`)
  const next: HTMLButtonElement | null = slider.querySelector(`*[${DATA_SLIDER}-next="${value}"]`)

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

const initProductsSlider = (container: Container) => {
  const slider: HTMLDivElement | null = container.querySelector(`*[${DATA_SLIDER}="products"]`)

  if (!slider) return

  const value = slider.dataset.slider

  if (!value) return

  const swiper: HTMLDivElement | null = slider.querySelector(`*[${DATA_SLIDER}-swiper="${value}"]`)

  if (!swiper) {
    handleValueError(value)
    return
  }

  const pagination: HTMLDivElement | null = slider.querySelector(`*[${DATA_SLIDER}-pagination="${value}"]`)
  const prev: HTMLButtonElement | null = slider.querySelector(`*[${DATA_SLIDER}-prev="${value}"]`)
  const next: HTMLButtonElement | null = slider.querySelector(`*[${DATA_SLIDER}-next="${value}"]`)

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

const initQuizSlider = (container: Container) => {
  const slider: HTMLDivElement | null = container.querySelector(`*[${DATA_SLIDER}="quiz"]`)

  if (!slider) return

  const value = slider.dataset.slider

  if (!value) return

  const swiper: HTMLDivElement | null = slider.querySelector(`*[${DATA_SLIDER}-swiper="${value}"]`)

  if (!swiper) {
    handleValueError(value)
    return
  }

  const pagination: HTMLDivElement | null = slider.querySelector(`*[${DATA_SLIDER}-pagination="${value}"]`)
  const prev: HTMLButtonElement | null = slider.querySelector(`*[${DATA_SLIDER}-prev="${value}"]`)
  const next: HTMLButtonElement | null = slider.querySelector(`*[${DATA_SLIDER}-next="${value}"]`)

  const checkSwiperSlide = (swiper: Swiper) => {
    const quiz: HTMLDivElement | null = swiper.el.closest(`[${DATA_QUIZ}]`)

    if (!quiz) return

    const visibleSlide: HTMLDivElement | null = quiz.querySelector('.swiper-slide-visible')

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
      renderCustom: (...[, current, total]) => {
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
      init: (swiper) => {
        checkSwiperSlide(swiper)
      },
      slideChange: (swiper) => {
        checkSwiperSlide(swiper)
      }
    }
  })
}

const initThumbsSlider = (container: Container) => {
  const slider: HTMLDivElement | null = container.querySelector(`*[${DATA_SLIDER}="thumbs"]`)

  if (!slider) return

  const value = slider.dataset.slider

  if (!value) return

  const swiper: HTMLDivElement | null = slider.querySelector(`*[${DATA_SLIDER}-swiper="${value}"]`)

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

const initBgSlider = (container: Container) => {
  const slider: HTMLDivElement | null = container.querySelector(`*[${DATA_SLIDER}="bg"]`)

  if (!slider) return

  const value = slider.dataset.slider

  if (!value) return

  const swiper: HTMLDivElement | null = slider.querySelector(`*[${DATA_SLIDER}-swiper="${value}"]`)

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

const initDescriptionSlider = (container: Container) => {
  const description: HTMLDivElement | null = container.querySelector('*[data-description]')

  if (!description) return

  const slider: HTMLDivElement | null = description.querySelector(`*[${DATA_SLIDER}="description"]`)

  if (!slider) return

  const value = slider.dataset.slider

  if (!value) return

  const swiper: HTMLDivElement | null = slider.querySelector(`*[${DATA_SLIDER}-swiper="${value}"]`)

  if (!swiper) {
    handleValueError(value)
    return
  }

  const thumbs = initThumbsSlider(description)
  const bg = initBgSlider(description)

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
      slideChange: (swiper) => {
        if (!bg) return

        bg.slideTo(swiper.activeIndex)
      }
    }
  })
}

export default (container: Container = document) => {
  initGallerySlider(container)
  initProductsSlider(container)
  initQuizSlider(container)
  initDescriptionSlider(container)
}
