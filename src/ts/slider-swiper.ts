import { media } from '@plugins/media'
import { checkQuizSlide } from '@ts/quiz'
import { Container } from '@utils'
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

const initGallerySlider = (container: Container = document): void => {
  const slider = container.querySelector('*[data-slider="gallery"]') as HTMLDivElement

  if (!slider || !slider.dataset.slider) return

  const value: string = slider.dataset.slider
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
    spaceBetween: 16,
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

const initProductsSlider = (container: Container = document): void => {
  const slider = container.querySelector('*[data-slider="products"]') as HTMLDivElement

  if (!slider || !slider.dataset.slider) return

  const value: string = slider.dataset.slider
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
    spaceBetween: 16,
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

const initQuizSlider = (container: Container = document): void => {
  const slider = container.querySelector('*[data-slider="quiz"]') as HTMLDivElement

  if (!slider || !slider.dataset.slider) return

  const value: string = slider.dataset.slider
  const swiper = slider.querySelector(`*[data-slider-swiper="${value}"]`) as HTMLDivElement
  const pagination = slider.querySelector(`*[data-slider-pagination="${value}"]`) as HTMLDivElement
  const prev = slider.querySelector(`*[data-slider-prev="${value}"]`) as HTMLButtonElement
  const next = slider.querySelector(`*[data-slider-next="${value}"]`) as HTMLButtonElement

  const checkSwiperSlide = (swiper: QuizSwiper): void => {
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
      renderCustom: (_, current: number, total: number): string => {
        return String(total - current)
      },
    },
    navigation: {
      prevEl: prev,
      nextEl: next,
    },
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 16,
    allowTouchMove: false,
    watchSlidesProgress: true,
    on: {
      init: (swiper: Swiper): void => checkSwiperSlide(swiper as QuizSwiper),
      slideChange: (swiper: Swiper): void => checkSwiperSlide(swiper as QuizSwiper),
    },
  }) as Swiper
}

const initThumbsSlider = (container: Container = document): Swiper | undefined => {
  const slider = container.querySelector('*[data-slider="thumbs"]') as HTMLDivElement

  if (!slider || !slider.dataset.slider) return

  const value: string = slider.dataset.slider
  const swiper = slider.querySelector(`*[data-slider-swiper="${value}"]`) as HTMLDivElement

  return new window.Swiper(swiper, {
    slidesPerView: 3,
    slidesPerGroup: 1,
    spaceBetween: 16,
    speed: 1000,
    grabCursor: true,
    breakpoints: {
      [md]: {
        slidesPerView: 4,
      },
    },
  }) as Swiper
}

const initBgSlider = (container: Container = document): Swiper | undefined => {
  const slider = container.querySelector('*[data-slider="bg"]') as HTMLDivElement

  if (!slider || !slider.dataset.slider) return

  const value: string = slider.dataset.slider
  const swiper = slider.querySelector(`*[data-slider-swiper="${value}"]`) as HTMLDivElement

  return new window.Swiper(swiper, {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 16,
    speed: 1000,
    allowTouchMove: false,
  }) as Swiper
}

const initDescriptionSlider = (container: Container = document): void => {
  const description = container.querySelector('*[data-description]') as HTMLElement

  if (!description) return

  const slider = description.querySelector('*[data-slider="description"]') as HTMLDivElement

  if (!slider || !slider.dataset.slider) return

  const value: string = slider.dataset.slider
  const swiper = slider.querySelector(`*[data-slider-swiper="${value}"]`) as HTMLDivElement
  const thumbs: Swiper | undefined = initThumbsSlider(description)
  const bg: Swiper | undefined = initBgSlider(description)

  new window.Swiper(swiper, {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 16,
    speed: 1000,
    grabCursor: true,
    thumbs: {
      swiper: thumbs,
    },
    on: {
      slideChange: (swiper: Swiper): void => {
        if (bg !== undefined) bg.slideTo(swiper.activeIndex)
      },
    },
  }) as Swiper
}

export default (): void => {
  initGallerySlider()
  initProductsSlider()
  initQuizSlider()
  initDescriptionSlider()
}
