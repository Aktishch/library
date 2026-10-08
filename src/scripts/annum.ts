import { getData } from '@utils'

const DATA_ANNUM = getData('annum')

export default (container: Document | HTMLElement = document) => {
  const annums = container.querySelectorAll<HTMLSpanElement>(`*[${DATA_ANNUM}]`)

  if (!annums.length) return

  const currentYear = String(new Date().getFullYear())

  annums.forEach((annum) => {
    annum.innerText = currentYear
  })
}
