import { getData } from '@utils'

const DATA_ANNUM = getData('annum')
const CURRENT_YEAR = String(new Date().getFullYear())

export default (container: Document | HTMLElement = document) => {
  const annums = container.querySelectorAll<HTMLSpanElement>(`*[${DATA_ANNUM}]`)

  if (!annums.length) return

  annums.forEach((annum) => {
    annum.innerText = CURRENT_YEAR
  })
}
