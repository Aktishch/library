import ymaps from 'ymaps'

declare global {
  interface Window {
    ymaps: typeof ymaps
  }
}

window.ymaps = ymaps

export default (): void => {
  const yandexMap = document.querySelector('*[data-yandex-map]') as HTMLDivElement

  if (!yandexMap) return

  const coordinates: string[] = String(yandexMap.dataset.yandexMap).split(',')
  const mark: number[] = []

  for (let i: number = 0; i < coordinates.length; i++) {
    mark.push(Number(coordinates[i]))
  }

  window.ymaps
    .load('https://api-maps.yandex.ru/2.1/?lang=ru_RU')
    .then((maps): void => {
      const inputs: Element[] = [...document.querySelectorAll('[data-suggest-view]')]

      const map = new maps.Map(yandexMap, {
        center: mark,
        zoom: 16,
      })

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
          iconImageHref: '/img/pictures/point.svg',
          iconImageSize: [62, 62],
          iconImageOffset: [-31, -31],
        }
      )

      inputs.forEach((input: Element): void => {
        new maps.SuggestView(input, {
          results: 5,
          container: document.body,
        })
      })

      map.controls.remove('geolocationControl')
      map.controls.remove('searchControl')
      map.controls.remove('trafficControl')
      map.controls.remove('typeSelector')
      map.controls.remove('fullscreenControl')
      map.controls.remove('zoomControl')
      map.controls.remove('rulerControl')
      map.behaviors.disable(['scrollZoom'])
      map.geoObjects.add(placemark)

      map.geoObjects.events.add('click', ((event: any): void => {
        const target = event.get('target')
        const hintContent: string = target.properties._data.hintContent

        map.panTo(target.geometry.getCoordinates(), {
          useMapMargin: true,
        })

        alert(hintContent)
      }) as EventListener)
    })
    .catch((error: string) => console.log('Failed to load Yandex Maps', error))
}
