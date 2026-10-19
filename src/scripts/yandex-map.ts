import { getData, isRu, logError, source } from '@utils'
import ymaps from 'ymaps'

declare global {
  interface Window {
    marks: number[][]
  }
}

type ymaps = typeof ymaps

interface YandexOptions extends ymaps {
  load: (api: string) => Promise<ymaps>
}

const DATA_YANDEX = getData('yandex')
const DATA_LOADER = getData('loader')
const LANGUARE = isRu ? 'ru_RU' : 'en_US'
const POINT_SIZE = [62, 62]
const { marks } = window
const MARKS_LENGTH = marks.length

const getCenter = (marks: number[][]) => {
  const coordinates = [0, 0]

  marks.forEach((mark) => {
    coordinates[0] += mark[0]
    coordinates[1] += mark[1]
  })

  return [coordinates[0] / MARKS_LENGTH, coordinates[1] / MARKS_LENGTH]
}

export default (container: Document | HTMLElement = document) => {
  const yandex: HTMLElement | null = container.querySelector(`*[${DATA_YANDEX}]`)

  if (!yandex) return

  if (!MARKS_LENGTH) {
    logError(isRu ? 'Отсутствуют элементы в window.marks' : 'There are no elements in window.marks')
    return
  }

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        const yandex = entry.target as HTMLElement

        if (entry.isIntersecting) {
          const yandexMap: HTMLElement | null = yandex.querySelector(`*[${DATA_YANDEX}-map]`)

          if (!yandexMap) return

          const loader: HTMLDivElement | null = yandex.querySelector(`*[${DATA_LOADER}]`)

          ;(ymaps as YandexOptions)
            .load(`https://api-maps.yandex.ru/2.1/?lang=${LANGUARE}`)
            .then((maps) => {
              const map = new maps.Map(yandexMap, {
                center: getCenter(marks),
                zoom: 16
              })

              map.controls.remove('geolocationControl')
              map.controls.remove('searchControl')
              map.controls.remove('trafficControl')
              map.controls.remove('typeSelector')
              map.controls.remove('fullscreenControl')
              map.controls.remove('zoomControl')
              map.controls.remove('rulerControl')
              map.behaviors.disable(['scrollZoom'])

              marks.forEach((mark) => {
                map.geoObjects.add(
                  new maps.Placemark(
                    mark,
                    {},
                    {
                      iconLayout: 'default#image',
                      iconImageHref: `${source}/img/pictures/point.svg`,
                      iconImageSize: POINT_SIZE,
                      iconImageOffset: [POINT_SIZE[0] / -2, POINT_SIZE[1] / -2]
                    }
                  )
                )
              })

              loader?.remove()
            })
            .catch((error: string) => {
              logError(error)
            })

          observer.unobserve(yandex)
        }
      })
    },
    {
      root: container === document ? null : container,
      rootMargin: '0px',
      threshold: 0
    }
  )

  observer.observe(yandex)
}
