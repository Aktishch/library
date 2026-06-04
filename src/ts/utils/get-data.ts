export const getData = (value: string): string => {
  return `data-${value}`
}

export const DATA_FORM: string = getData('form')
export const DATA_LABEL: string = getData('label')
export const DATA_INPUT: string = getData('input')
export const DATA_ERROR: string = getData('error')
