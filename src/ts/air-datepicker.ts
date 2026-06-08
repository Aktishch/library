import filtering from '@ts/filtering'
import { Container, getData, getTouchDevice, isEn, logError, TimeOut } from '@utils'
import AirDatepicker, { AirDatepickerPosition, AirDatepickerViewsSingle } from 'air-datepicker'
import localeRu from 'air-datepicker/locale/ru'

type Wrapper = HTMLElement | ''
type Dialog = HTMLDivElement | null
type Calendar = HTMLDivElement | null
type Input = HTMLInputElement | null

type Attrs = {
  'data-filtering-category': string
  'data-filtering-value': string
  'data-waved': string
  'data-active'?: string
}

interface CalendarOptions {
  date: Date
  cellType: AirDatepickerViewsSingle
}

interface CalendarCell {
  classes: string
  attrs: Attrs
}

const DATA_DATEPICKER: string = getData('datepicker')
const EXCLUDE_DATES: number[] = [+new Date(2026, 4, 5), +new Date(2026, 4, 7), +new Date(2026, 5, 10)]

const handleInputsError = (): void => {
  logError(
    isEn
      ? `The ${DATA_DATEPICKER} does not have a ${DATA_DATEPICKER}-(min, max) child element`
      : `У ${DATA_DATEPICKER} отсутствует дочерний элемент ${DATA_DATEPICKER}-(min, max)`
  )
}

const getFancybox = (container: Container): Wrapper => {
  const dialog: Dialog = container.querySelector('.f-html')

  return container !== document && dialog ? dialog : ''
}

export const initCalendar = (container: Container = document): void => {
  const calendar: Calendar = container.querySelector(`*[${DATA_DATEPICKER}-calendar]`)

  if (!calendar) return

  const dates: number[] = []
  let timeOut: TimeOut

  const renderCalendarCell = ({ date, cellType }: CalendarOptions): CalendarCell | undefined => {
    if (cellType === 'day') {
      if (timeOut) {
        clearTimeout(timeOut)
      }

      const condition: boolean = EXCLUDE_DATES.includes(+date)
      const classes: string = condition
        ? 'btn btn-primary btn-fill text-sm [&[data-active]]:opacity-50 [&[data-active]]:pointer-events-none'
        : 'pointer-events-none'
      const attrs: Attrs = {
        'data-filtering-category': 'calendar',
        'data-filtering-value': `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
        'data-waved': 'light'
      }

      if (condition) {
        dates.push(+date)
      }

      if (dates.length && dates[0] === +date) {
        attrs['data-active'] = ''
      }

      timeOut = setTimeout((): void => {
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

export default (container: Container = document): void => {
  const datepickers: NodeListOf<HTMLFormElement> = container.querySelectorAll(`*[${DATA_DATEPICKER}]`)

  if (!datepickers.length) return

  const wrapper: Wrapper = getFancybox(container)
  const isMobile: boolean = wrapper === '' ? getTouchDevice() : false

  datepickers.forEach((datepicker: HTMLFormElement): void => {
    const inputMin: Input = datepicker.querySelector(`*[${DATA_DATEPICKER}-min]`)
    const inputMax: Input = datepicker.querySelector(`*[${DATA_DATEPICKER}-max]`)

    if (!inputMin || !inputMax) {
      handleInputsError()
      return
    }

    const min: AirDatepicker<HTMLInputElement> = new AirDatepicker(inputMin, {
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
      position: (inputMin.dataset.position as AirDatepickerPosition) || 'bottom left'
    })

    const max: AirDatepicker<HTMLInputElement> = new AirDatepicker(inputMax, {
      onSelect({ date }) {
        min.update({
          maxDate: String(date)
        })
      },
      container: wrapper,
      isMobile,
      autoClose: true,
      minDate: new Date(),
      position: (inputMax.dataset.position as AirDatepickerPosition) || 'bottom left'
    })
  })
}
