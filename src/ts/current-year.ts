import { Container } from '@utils'

export default (container: Container = document): void => {
  const years = container.querySelectorAll('*[data-current-year]') as NodeListOf<HTMLSpanElement>

  if (!years.length) return

  const currentYear: string = String(new Date().getFullYear())

  years.forEach((year: HTMLSpanElement): void => {
    year.innerText = currentYear
  })
}
