import { createError, en } from '@utils'
import ymaps from 'ymaps'

type ymaps = typeof ymaps

interface YandexMap extends ymaps {
  load: (api: string) => Promise<ymaps>
}

declare global {
  interface Window {
    ymaps: YandexMap
  }
}

window.ymaps = ymaps as YandexMap

export default (): void => {
  const yandex = document.querySelector('*[data-yandex]') as HTMLElement

  if (!yandex) return

  const yandexMap = yandex.querySelector('*[data-yandex-map]') as HTMLDivElement

  if (yandexMap.dataset.yandexMap) {
    const loader = yandex.querySelector('*[data-loader]') as HTMLDivElement
    const coordinates: string[] = yandexMap.dataset.yandexMap.split(',')
    const point: string = yandexMap.dataset.point || ''
    const pointSize: number[] = [62, 62]
    const lang: string = en ? 'en_US' : 'ru_RU'
    const mark: number[] = []

    for (let i: number = 0; i < coordinates.length; i++) mark.push(Number(coordinates[i]))

    window.ymaps
      .load(`https://api-maps.yandex.ru/2.1/?lang=${lang}`)
      .then((maps: ymaps): void => {
        const map = new maps.Map(yandexMap, {
          center: mark,
          zoom: 16,
        }) as ymaps.Map

        const placemark = new maps.Placemark(
          mark,
          {
            hintContent: 'Студия К.И.Т.',
            balloonContentHeader: 'Студия К.И.Т.',
            balloonContentBody: 'г. Краснодар',
            balloonContentFooter: 'ул.Рождественская Набережная 45/1',
          },
          {
            iconLayout: 'default#image',
            iconImageHref: point,
            iconImageSize: pointSize,
            iconImageOffset: [pointSize[0] / -2, pointSize[1] / -2],
          }
        ) as ymaps.Placemark

        map.controls.remove('geolocationControl')
        map.controls.remove('searchControl')
        map.controls.remove('trafficControl')
        map.controls.remove('typeSelector')
        map.controls.remove('fullscreenControl')
        map.controls.remove('zoomControl')
        map.controls.remove('rulerControl')
        map.behaviors.disable(['scrollZoom'])
        map.geoObjects.add(placemark)
        loader.remove()

        map.geoObjects.events.add<'click'>('click', (event: ymaps.IEvent<PointerEvent, {}>): void => {
          const target: EventTarget | any = event.get('target')
          const hintContent = target.properties._data.hintContent

          map.panTo(target.geometry.getCoordinates(), {
            useMapMargin: true,
          })

          alert(hintContent)
        })
      })
      .catch((error: string) => createError(error))
  }
}
