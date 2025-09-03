import AirDatepicker, { AirDatepickerPosition } from 'air-datepicker'
import localeRu from 'air-datepicker/locale/ru'
import filtering from './filtering'
import { touchDevice } from './utils'

type AirDatepickerCell = {
  date: Date
  cellType: string
}

type AirDatepickerRenderCell = {
  classes: string
  attrs: {
    'data-filtering-category': string
    'data-filtering-value': string
  }
}

const excludeDates: number[] = [+new Date(2025, 8, 5), +new Date(2025, 8, 7), +new Date(2025, 9, 10)]

declare global {
  interface Window {
    AirDatepicker: typeof AirDatepicker
    excludeDates: typeof excludeDates
  }
}

window.AirDatepicker = AirDatepicker
window.excludeDates = excludeDates

export const createCalendar = (): void => {
  const calendar = document.getElementById('calendar') as HTMLDivElement

  if (!calendar) return

  const renderCellHandler = ({ date, cellType }: AirDatepickerCell): AirDatepickerRenderCell | undefined => {
    if (cellType === 'day') {
      return {
        classes: window.excludeDates.includes(+date)
          ? 'filtering-active btn btn-primary btn-fill text-sm'
          : 'pointer-events-none',
        attrs: {
          'data-filtering-category': 'calendar',
          'data-filtering-value': `date-${date.getDate()}-${date.getMonth() + 1}`,
        },
      }
    }
  }

  new window.AirDatepicker(calendar, {
    locale: localeRu,
    onChangeViewDate: (): void => {
      calendar.classList.add('opacity-20', 'pointer-events-none')
      setTimeout((): void => {
        filtering()
        calendar.classList.remove('opacity-20', 'pointer-events-none')
      }, 500)
    },
    onRenderCell: renderCellHandler,
    selectedDates: [new Date()],
  }) as AirDatepicker<HTMLDivElement>
}

export default (): void => {
  const datepickers = document.querySelectorAll('*[data-datepicker]') as NodeListOf<HTMLFormElement>

  datepickers.forEach((datepicker: HTMLFormElement): void => {
    if (!datepicker) return

    const inputMin = datepicker.querySelector('*[data-datepicker-min]') as HTMLInputElement
    const inputMax = datepicker.querySelector('*[data-datepicker-max]') as HTMLInputElement

    const min = new window.AirDatepicker(inputMin, {
      onSelect({ date }) {
        max.update({
          minDate: String(date),
        })
      },
      locale: localeRu,
      isMobile: touchDevice(),
      autoClose: true,
      minDate: new Date(),
      position: (inputMin.dataset.position as AirDatepickerPosition) || 'bottom left',
    }) as AirDatepicker<HTMLInputElement>

    const max = new window.AirDatepicker(inputMax, {
      onSelect({ date }) {
        min.update({
          maxDate: String(date),
        })
      },
      locale: localeRu,
      isMobile: touchDevice(),
      autoClose: true,
      minDate: new Date(),
      position: (inputMax.dataset.position as AirDatepickerPosition) || 'bottom left',
    }) as AirDatepicker<HTMLInputElement>
  })
}
