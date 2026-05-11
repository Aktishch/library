import accordion from '@ts/accordion'
import airDatepicker from '@ts/air-datepicker'
import animation from '@ts/animation'
import canvasRendering from '@ts/canvas-rendering'
import combination from '@ts/combination'
import compare from '@ts/compare'
import cookie from '@ts/cookie'
import copy from '@ts/copy'
import currentTab from '@ts/current-tab'
import currentYear from '@ts/current-year'
import dataSave from '@ts/data-save'
import draggable from '@ts/draggable'
import fancybox from '@ts/fancybox'
import fileList from '@ts/file-list'
import filtering from '@ts/filtering'
import formatBg from '@ts/format-bg'
import game from '@ts/game'
import horizontalScrolling from '@ts/horizontal-scrolling'
import imagePreview from '@ts/image-preview'
import input from '@ts/input'
import inverted from '@ts/inverted'
import lazyLoad from '@ts/lazy-load'
import listing from '@ts/listing'
import locomotiveScroll from '@ts/locomotive-scroll'
import menu from '@ts/menu'
import movement from '@ts/movement'
import outNumbers from '@ts/out-numbers'
import pallete from '@ts/pallete'
import parallax from '@ts/parallax'
import password from '@ts/password'
import phoneMask from '@ts/phone-mask'
import player from '@ts/player'
import preloader from '@ts/preloader'
import progressLine from '@ts/progress-line'
import quantity from '@ts/quantity'
import quiz from '@ts/quiz'
import range from '@ts/range'
import runningButton from '@ts/running-button'
import scrollHeader from '@ts/scroll-header'
import scrollTo from '@ts/scroll-to'
import shop from '@ts/shop'
import sidebar from '@ts/sidebar'
import sliderSwiper from '@ts/slider-swiper'
import smartMenu from '@ts/smart-menu'
import snowflakes from '@ts/snowflakes'
import social from '@ts/social'
import submitHandler from '@ts/submit-handler'
import theme from '@ts/theme'
import timeCounter from '@ts/time-counter'
import timer from '@ts/timer'
import warning from '@ts/warning'
import waved from '@ts/waved'
import worldMap from '@ts/world-map'
import writeText from '@ts/write-text'
import yandexMap from '@ts/yandex-map'

import '@fancyapps/ui/dist/fancybox/fancybox.css'
import 'air-datepicker/air-datepicker.css'
import 'locomotive-scroll/dist/locomotive-scroll.css'
import 'swiper/css/bundle'
import './scss/main.scss'

window.addEventListener('DOMContentLoaded', ((): void => {
  accordion()
  airDatepicker()
  canvasRendering()
  combination()
  compare()
  cookie()
  copy()
  currentTab()
  currentYear()
  dataSave()
  draggable()
  fancybox()
  fileList()
  filtering()
  formatBg()
  game()
  horizontalScrolling()
  imagePreview()
  input()
  inverted()
  lazyLoad()
  listing()
  menu()
  movement()
  pallete()
  parallax()
  password()
  phoneMask()
  player()
  progressLine()
  quantity()
  quiz()
  range()
  runningButton()
  scrollHeader()
  scrollTo()
  shop()
  sidebar()
  sliderSwiper()
  smartMenu()
  locomotiveScroll()
  snowflakes()
  social()
  submitHandler()
  theme()
  timeCounter()
  timer()
  warning()
  waved()
  worldMap()
  yandexMap()
  preloader().finally((): void => {
    animation()
    outNumbers()
    writeText()
  })
}) as EventListener)
