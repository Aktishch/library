import filtering from '@ts/filtering'
import { Container, touchDevice } from '@utils'
import AirDatepicker, { AirDatepickerPosition } from 'air-datepicker'
import localeRu from 'air-datepicker/locale/ru'

declare global {
  interface Window {
    AirDatepicker: typeof AirDatepicker
  }
}

interface AirDatepickerCell {
  date: Date
  cellType: string
}

type Attrs = {
  'data-filtering-category': string
  'data-filtering-value': string
  'data-waved': string
  'data-active'?: string
}

interface AirDatepickerRenderCell {
  classes: string
  attrs: Attrs
}

type Dates = { date: Date | Date[] }

const excludeDates: number[] = [+new Date(2026, 4, 5), +new Date(2026, 4, 7), +new Date(2026, 5, 10)]

window.AirDatepicker = AirDatepicker

export const createCalendar = (container: Container = document): void => {
  const calendar = container.querySelector('#calendar') as HTMLDivElement

  if (!calendar) return

  const dates: number[] = []
  let timeOut: NodeJS.Timeout

  const renderCellHandler = ({ date, cellType }: AirDatepickerCell): AirDatepickerRenderCell | undefined => {
    if (cellType === 'day') {
      if (timeOut) clearTimeout(timeOut)

      const condition: boolean = excludeDates.includes(+date)
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

      timeOut = setTimeout((): void => {
        dates.length = 0
        filtering(container)
      }, 50)

      return { classes, attrs }
    }
  }

  new window.AirDatepicker(calendar, {
    locale: localeRu,
    onRenderCell: renderCellHandler,
    selectedDates: [new Date()],
  }) as AirDatepicker<HTMLDivElement>

  filtering(container)
}

export default (container: Container = document): void => {
  const datepickers = container.querySelectorAll('*[data-datepicker]') as NodeListOf<HTMLFormElement>

  datepickers.forEach((datepicker: HTMLFormElement): void => {
    if (!datepicker) return

    const inputMin = datepicker.querySelector('*[data-datepicker-min]') as HTMLInputElement
    const inputMax = datepicker.querySelector('*[data-datepicker-max]') as HTMLInputElement

    const min = new window.AirDatepicker(inputMin, {
      onSelect({ date }: Dates) {
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
      onSelect({ date }: Dates) {
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
