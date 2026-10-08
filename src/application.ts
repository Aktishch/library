import accordion from '@scripts/accordion'
import airDatepicker from '@scripts/air-datepicker'
import animation from '@scripts/animation'
import annum from '@scripts/annum'
import canvasRendering from '@scripts/canvas-rendering'
import combination from '@scripts/combination'
import compare from '@scripts/compare'
import cookie from '@scripts/cookie'
import copy from '@scripts/copy'
import currentTab from '@scripts/current-tab'
import dataSave from '@scripts/data-save'
import draggable from '@scripts/draggable'
import fancybox from '@scripts/fancybox'
import fileList from '@scripts/file-list'
import filtering from '@scripts/filtering'
import game from '@scripts/game'
import horizontalScrolling from '@scripts/horizontal-scrolling'
import imagePreview from '@scripts/image-preview'
import input from '@scripts/input'
import lazyLoad from '@scripts/lazy-load'
import listing from '@scripts/listing'
import locomotiveScroll from '@scripts/locomotive-scroll'
import menu from '@scripts/menu'
import movement from '@scripts/movement'
import outNumbers from '@scripts/out-numbers'
import palette from '@scripts/palette'
import parallax from '@scripts/parallax'
import password from '@scripts/password'
import phoneMask from '@scripts/phone-mask'
import player from '@scripts/player'
import preloader from '@scripts/preloader'
import quantity from '@scripts/quantity'
import quiz from '@scripts/quiz'
import range from '@scripts/range'
import runningButton from '@scripts/running-button'
import scrollHeader from '@scripts/scroll-header'
import scrollTo from '@scripts/scroll-to'
import shop from '@scripts/shop'
import sidebar from '@scripts/sidebar'
import smartMenu from '@scripts/smart-menu'
import snowflakes from '@scripts/snowflakes'
import social from '@scripts/social'
import submitHandler from '@scripts/submit-handler'
import swiper from '@scripts/swiper'
import theme from '@scripts/theme'
import timeCounter from '@scripts/time-counter'
import timer from '@scripts/timer'
import warning from '@scripts/warning'
import waved from '@scripts/waved'
import world from '@scripts/world'
import writeText from '@scripts/write-text'
import yandexMap from '@scripts/yandex-map'

import './tailwind/style.css'

const initApplication = () => {
  console.info('Frontend-developer: Aktishch')
  accordion()
  airDatepicker()
  annum()
  canvasRendering()
  combination()
  compare()
  cookie()
  copy()
  currentTab()
  dataSave()
  draggable()
  fancybox()
  fileList()
  filtering()
  game()
  horizontalScrolling()
  imagePreview()
  input()
  lazyLoad()
  listing()
  locomotiveScroll()
  menu()
  movement()
  palette()
  parallax()
  password()
  phoneMask()
  player()
  quantity()
  quiz()
  range()
  runningButton()
  scrollHeader()
  scrollTo()
  shop()
  sidebar()
  smartMenu()
  snowflakes()
  social()
  submitHandler()
  swiper()
  theme()
  timeCounter()
  timer()
  warning()
  waved()
  world()
  yandexMap()
  preloader().finally(() => {
    animation()
    outNumbers()
    writeText()
  })
}

window.addEventListener('DOMContentLoaded', initApplication)
