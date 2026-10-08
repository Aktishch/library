import filtering from '@scripts/filtering'
import { getData, getTouchDevice, isEn, logError } from '@utils'
import AirDatepicker, { AirDatepickerPosition, AirDatepickerViewsSingle } from 'air-datepicker'
import localeRu from 'air-datepicker/locale/ru'

interface CalendarOptions {
  date: Date
  cellType: AirDatepickerViewsSingle
}

const DATA_DATEPICKER = getData('datepicker')
const EXCLUDE_DATES = [+new Date(2026, 8, 5), +new Date(2026, 8, 7), +new Date(2026, 9, 10)]

const getFancybox = (container: Document | HTMLElement) => {
  const dialog: HTMLDivElement | null = container.querySelector('.f-html')

  return container !== document && dialog ? dialog : ''
}

export const initCalendar = (container: Document | HTMLElement = document) => {
  const calendar: HTMLDivElement | null = container.querySelector(`*[${DATA_DATEPICKER}-calendar]`)

  if (!calendar) return

  const dates: number[] = []
  let timeOut: NodeJS.Timeout | undefined

  const renderCalendarCell = ({ date, cellType }: CalendarOptions) => {
    if (cellType === 'day') {
      if (timeOut) {
        clearTimeout(timeOut)
      }

      const condition = EXCLUDE_DATES.includes(+date)
      const classes = condition
        ? 'btn btn-primary btn-fill text-sm data-active:opacity-50 data-active:pointer-events-none'
        : 'pointer-events-none'
      const attrs = {
        'data-filtering-category': 'calendar',
        'data-filtering-value': `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
        'data-waved': ''
      }

      if (condition) {
        dates.push(+date)
      }

      if (dates.length && dates[0] === +date) {
        attrs['data-active'] = ''
      }

      timeOut = setTimeout(() => {
        dates.length = 0
        filtering(container)
      }, 50)

      return { classes, attrs }
    }
  }

  new AirDatepicker(calendar, {
    locale: localeRu,
    onRenderCell: renderCalendarCell,
    selectedDates: [new Date()]
  })

  filtering(container)
}

export default (container: Document | HTMLElement = document) => {
  const datepickers = container.querySelectorAll<HTMLFormElement>(`*[${DATA_DATEPICKER}]`)

  if (!datepickers.length) return

  const wrapper = getFancybox(container)
  const isMobile = wrapper === '' ? getTouchDevice() : false

  datepickers.forEach((datepicker) => {
    const inputMin: HTMLInputElement | null = datepicker.querySelector(`*[${DATA_DATEPICKER}-min]`)
    const inputMax: HTMLInputElement | null = datepicker.querySelector(`*[${DATA_DATEPICKER}-max]`)

    if (!inputMin || !inputMax) {
      logError(
        isEn
          ? `The ${DATA_DATEPICKER} does not have a ${DATA_DATEPICKER}-(min, max) child element`
          : `У ${DATA_DATEPICKER} отсутствует дочерний элемент ${DATA_DATEPICKER}-(min, max)`
      )
      return
    }

    const min = new AirDatepicker(inputMin, {
      onSelect({ date }) {
        max.update({
          minDate: String(date)
        })
      },
      locale: localeRu,
      container: wrapper,
      isMobile,
      autoClose: true,
      minDate: new Date(),
      position: (inputMin.dataset.position || 'bottom left') as AirDatepickerPosition
    })

    const max = new AirDatepicker(inputMax, {
      onSelect({ date }) {
        min.update({
          maxDate: String(date)
        })
      },
      container: wrapper,
      isMobile,
      autoClose: true,
      minDate: new Date(),
      position: (inputMax.dataset.position || 'bottom left') as AirDatepickerPosition
    })
  })
}
