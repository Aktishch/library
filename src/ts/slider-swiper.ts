import { media } from '@plugins/media'
import { checkQuizSlide } from '@ts/quiz'
import Swiper from 'swiper'
import { Autoplay, EffectCoverflow, Grid, Navigation, Pagination, Scrollbar, Thumbs } from 'swiper/modules'

interface QuizSwiper extends Swiper {
  visibleSlides: HTMLDivElement[]
}

declare global {
  interface Window {
    Swiper: typeof Swiper
  }
}

Swiper.use([Autoplay, EffectCoverflow, Grid, Navigation, Pagination, Scrollbar, Thumbs])
Swiper.defaults.touchStartPreventDefault = false
window.Swiper = Swiper

const { sm, md, lg, xl } = media

const createGallerySlider = (): void => {
  const slider = document.querySelector('*[data-slider="gallery"]') as HTMLDivElement

  if (!slider) return

  const value: string = String(slider.dataset.slider)
  const swiper = slider.querySelector(`*[data-slider-swiper="${value}"]`) as HTMLDivElement
  const pagination = slider.querySelector(`*[data-slider-pagination="${value}"]`) as HTMLDivElement
  const prev = slider.querySelector(`*[data-slider-prev="${value}"]`) as HTMLButtonElement
  const next = slider.querySelector(`*[data-slider-next="${value}"]`) as HTMLButtonElement

  new window.Swiper(swiper, {
    pagination: {
      el: pagination,
      clickable: true,
    },
    navigation: {
      prevEl: prev,
      nextEl: next,
    },
    effect: 'coverflow',
    slidesPerView: 1.3,
    spaceBetween: 20,
    grabCursor: true,
    watchSlidesProgress: true,
    loop: true,
    freeMode: true,
    breakpoints: {
      [sm]: {
        slidesPerView: 2,
      },
      [lg]: {
        slidesPerView: 3,
      },
    },
    autoplay: {
      delay: 3000,
      stopOnLastSlide: false,
      disableOnInteraction: false,
    },
  }) as Swiper
}

const createProductsSlider = (): void => {
  const slider = document.querySelector('*[data-slider="products"]') as HTMLDivElement

  if (!slider) return

  const value: string = String(slider.dataset.slider)
  const swiper = slider.querySelector(`*[data-slider-swiper="${value}"]`) as HTMLDivElement
  const pagination = slider.querySelector(`*[data-slider-pagination="${value}"]`) as HTMLDivElement
  const prev = slider.querySelector(`*[data-slider-prev="${value}"]`) as HTMLButtonElement
  const next = slider.querySelector(`*[data-slider-next="${value}"]`) as HTMLButtonElement

  new window.Swiper(swiper, {
    pagination: {
      el: pagination,
      clickable: true,
    },
    navigation: {
      prevEl: prev,
      nextEl: next,
    },
    slidesPerView: 1.3,
    slidesPerGroup: 1,
    spaceBetween: 20,
    grabCursor: true,
    watchSlidesProgress: true,
    breakpoints: {
      [sm]: {
        slidesPerView: 2,
      },
      [lg]: {
        slidesPerView: 3,
      },
      [xl]: {
        slidesPerView: 4,
      },
    },
  }) as Swiper
}

const createQuizSlider = (): void => {
  const slider = document.querySelector('*[data-slider="quiz"]') as HTMLDivElement

  if (!slider) return

  const value: string = String(slider.dataset.slider)
  const swiper = slider.querySelector(`*[data-slider-swiper="${value}"]`) as HTMLDivElement
  const pagination = slider.querySelector(`*[data-slider-pagination="${value}"]`) as HTMLDivElement
  const prev = slider.querySelector(`*[data-slider-prev="${value}"]`) as HTMLButtonElement
  const next = slider.querySelector(`*[data-slider-next="${value}"]`) as HTMLButtonElement

  const checkSlide = (swiper: QuizSwiper): void => {
    const quiz = swiper.el.closest('[data-quiz]') as HTMLElement
    const visibleSlide = swiper.visibleSlides[0] as HTMLDivElement

    checkQuizSlide(visibleSlide)

    visibleSlide === swiper.slides[swiper.slides.length - 1]
      ? quiz.setAttribute('data-quiz-end', '')
      : quiz.removeAttribute('data-quiz-end')
  }

  new window.Swiper(swiper, {
    pagination: {
      el: pagination,
      type: 'custom',
      renderCustom: (_: Swiper, current: number, total: number): string => {
        return String(total - current)
      },
    },
    navigation: {
      prevEl: prev,
      nextEl: next,
    },
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 30,
    allowTouchMove: false,
    watchSlidesProgress: true,
    on: {
      init: (swiper: Swiper): void => checkSlide(swiper as QuizSwiper),
      slideChange: (swiper: Swiper): void => checkSlide(swiper as QuizSwiper),
    },
  }) as Swiper
}

const createDescriptionSlider = (): void => {
  const slider = document.querySelector('*[data-slider="description"]') as HTMLDivElement

  if (!slider) return

  const sliderBg = document.querySelector('*[data-slider="description-bg"]') as HTMLDivElement
  const valueBg: string = String(sliderBg.dataset.slider)
  const swiperBg = sliderBg.querySelector(`*[data-slider-swiper="${valueBg}"]`) as HTMLDivElement
  const descriptionBg: Swiper = new window.Swiper(swiperBg, {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 30,
    speed: 1000,
    allowTouchMove: false,
  })

  const sliderBullets = document.querySelector('*[data-slider="description-bullets"]') as HTMLDivElement
  const valueBullets: string = String(sliderBullets.dataset.slider)
  const swiperBullets = sliderBullets.querySelector(`*[data-slider-swiper="${valueBullets}"]`) as HTMLDivElement
  const descriptionBullets: Swiper = new window.Swiper(swiperBullets, {
    slidesPerView: 3,
    slidesPerGroup: 1,
    spaceBetween: 20,
    speed: 1000,
    grabCursor: true,
    breakpoints: {
      [md]: {
        slidesPerView: 4,
      },
    },
  })

  const value: string = String(slider.dataset.slider)
  const swiper = slider.querySelector(`*[data-slider-swiper="${value}"]`) as HTMLDivElement

  new window.Swiper(swiper, {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 30,
    speed: 1000,
    grabCursor: true,
    thumbs: {
      swiper: descriptionBullets,
    },
    on: {
      slideChange: (swiper: Swiper): void => {
        descriptionBg.slideTo(swiper.activeIndex)
      },
    },
  }) as Swiper
}

export default (): void => {
  createGallerySlider()
  createProductsSlider()
  createQuizSlider()
  createDescriptionSlider()
}
