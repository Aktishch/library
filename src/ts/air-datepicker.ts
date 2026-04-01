import AirDatepicker, { AirDatepickerPosition } from 'air-datepicker'
import localeRu from 'air-datepicker/locale/ru'
import filtering from './filtering'
import { touchDevice } from './utils'

declare global {
  interface Window {
    AirDatepicker: typeof AirDatepicker
    excludeDates: number[]
  }
}

type AirDatepickerCell = {
  date: Date
  cellType: string
}

type Attrs = {
  'data-filtering-category': string
  'data-filtering-value': string
  'data-waved': string
  'data-active'?: string
}

type AirDatepickerRenderCell = {
  classes: string
  attrs: Attrs
}

const excludeDates: number[] = [+new Date(2026, 1, 5), +new Date(2026, 1, 7), +new Date(2026, 2, 10)]
const className: string[] = ['opacity-20', 'pointer-events-none']

window.AirDatepicker = AirDatepicker
window.excludeDates = excludeDates

export const createCalendar = (): void => {
  const calendar = document.getElementById('calendar') as HTMLDivElement

  if (!calendar) return

  const dates: number[] = []

  const renderCellHandler = ({ date, cellType }: AirDatepickerCell): AirDatepickerRenderCell | undefined => {
    if (cellType === 'day') {
      const condition: boolean = window.excludeDates.includes(+date)
      const classes: string = condition
        ? 'btn btn-primary btn-fill text-sm [&[data-active]]:opacity-50 [&[data-active]]:pointer-events-none'
        : 'pointer-events-none'
      const attrs: Attrs = {
        'data-filtering-category': 'calendar',
        'data-filtering-value': `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
        'data-waved': 'light',
      }

      if (condition) dates.push(+date)
      if (dates.length !== 0 && dates[0] === +date) attrs['data-active'] = ''

      return { classes, attrs }
    }
  }

  new window.AirDatepicker(calendar, {
    locale: localeRu,
    onChangeViewDate: (): void => {
      dates.length = 0
      calendar.classList.add(...className)
      setTimeout((): void => {
        filtering()
        calendar.classList.remove(...className)
      }, 500)
    },
    onRenderCell: renderCellHandler,
    selectedDates: [new Date()],
  }) as AirDatepicker<HTMLDivElement>

  filtering()
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
