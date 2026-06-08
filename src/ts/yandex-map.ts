import { Container, getData, isEn, logError, source } from '@utils'
import ymaps from 'ymaps'

type ymaps = typeof ymaps
type Yandex = HTMLElement | null
type YandexMap = HTMLElement | null
type Value = string | undefined
type Loader = HTMLDivElement | null

interface YandexOptions extends ymaps {
  load: (api: string) => Promise<ymaps>
}

const DATA_YANDEX: string = getData('yandex')
const YANDEX_LANGUARE: string = isEn ? 'en_US' : 'ru_RU'

const handleValueError = (): void => {
  logError(isEn ? `${DATA_YANDEX}-map is missing a value` : `У ${DATA_YANDEX}-map отсутствует значение`)
}

export default (container: Container = document): void => {
  const yandex: Yandex = container.querySelector(`*[${DATA_YANDEX}]`)

  if (!yandex) return

  const yandexMap: YandexMap = yandex.querySelector(`*[${DATA_YANDEX}-map]`)

  if (!yandexMap) return

  const value: Value = yandexMap.dataset.yandexMap

  if (!value) {
    handleValueError()
    return
  }

  const loader: Loader = yandex.querySelector('*[data-loader]')
  const coordinates: string[] = value.split(',')
  const pointSize: number[] = [62, 62]
  const mark: number[] = []

  for (let i: number = 0; i < coordinates.length; i++) {
    mark.push(Number(coordinates[i]))
  }

  ;(ymaps as YandexOptions)
    .load(`https://api-maps.yandex.ru/2.1/?lang=${YANDEX_LANGUARE}`)
    .then((maps: ymaps): void => {
      const map: ymaps.Map = new maps.Map(yandexMap, {
        center: mark,
        zoom: 16
      })
      const placemark: ymaps.Placemark = new maps.Placemark(
        mark,
        {},
        {
          iconLayout: 'default#image',
          iconImageHref: `${source}/img/pictures/point.svg`,
          iconImageSize: pointSize,
          iconImageOffset: [pointSize[0] / -2, pointSize[1] / -2]
        }
      )

      map.controls.remove('geolocationControl')
      map.controls.remove('searchControl')
      map.controls.remove('trafficControl')
      map.controls.remove('typeSelector')
      map.controls.remove('fullscreenControl')
      map.controls.remove('zoomControl')
      map.controls.remove('rulerControl')
      map.behaviors.disable(['scrollZoom'])
      map.geoObjects.add(placemark)
      loader?.remove()
    })
    .catch((error: string): void => {
      logError(error)
    })
}
