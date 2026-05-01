import { Container } from '@utils'

export default (container: Container = document): void => {
  const years = container.querySelectorAll('*[data-current-year]') as NodeListOf<HTMLSpanElement>

  years.forEach((year: HTMLSpanElement): void => {
    if (year) year.innerText = String(new Date().getFullYear())
  })
}
