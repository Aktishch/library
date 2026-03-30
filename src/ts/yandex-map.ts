import ymaps from 'ymaps'
import { en } from './utils'

type ymaps = typeof ymaps

declare global {
  interface Window {
    ymaps: ymaps & {
      load?: (api: string) => Promise<ymaps>
    }
  }
}

window.ymaps = ymaps

export default (): void => {
  const yandex = document.querySelector('*[data-yandex]') as HTMLElement

  if (!yandex) return

  const yandexMap = yandex.querySelector('*[data-yandex-map]') as HTMLDivElement
  const loader = yandex.querySelector('*[data-loader]') as HTMLDivElement
  const coordinates: string[] = String(yandexMap.dataset.yandexMap).split(',')
  const point: string = String(yandexMap.dataset.point)
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
          iconImageSize: [62, 62],
          iconImageOffset: [-31, -31],
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
    .catch((error: string) => console.log(error))
}
