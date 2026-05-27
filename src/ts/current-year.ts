import { Container } from '@utils'

export default (container: Container = document): void => {
  const years: NodeListOf<HTMLSpanElement> = container.querySelectorAll('*[data-current-year]')

  if (!years.length) return

  const currentYear: string = String(new Date().getFullYear())

  years.forEach((year: HTMLSpanElement): void => {
    year.innerText = currentYear
  })
}
