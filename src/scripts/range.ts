import { getData, isEn, logError } from '@utils'

interface BubbleOptions {
  size: number
  number: number
  input: HTMLInputElement
  progress: HTMLDivElement
  bubble: HTMLOutputElement
}

const DATA_RANGE = getData('range')
const FIRST = 0
const LAST = 1

const handleElementsError = () => {
  logError(
    isEn
      ? `The ${DATA_RANGE} does not have a ${DATA_RANGE}-(output, input, progress, bubble) child element`
      : `У ${DATA_RANGE} отсутствует дочерний элемент ${DATA_RANGE}-(output, input, progress, bubble)`
  )
}

const setBubblePosition = ({ size, number, input, progress, bubble }: BubbleOptions) => {
  const percent = size / 100
  const half = size / 2
  const value = Number(input.value)
  const min = Number(input.min) || 0
  const max = Number(input.max) || 100
  let step: number

  switch (number) {
    case FIRST: {
      step = ((value - min) * 100) / (max - min)
      progress.style.left = '0'
      bubble.style.left = `calc(${step}% - (${step * percent}px))`
      progress.style.width = `calc(${step}% + (${half - step * percent}px))`
      break
    }

    case LAST: {
      step = ((max - value) * 100) / (max - min)
      progress.style.right = '0'
      bubble.style.right = `calc(${step}% - (${step * percent}px))`
      progress.style.width = `calc(${step}% + (${half - step * percent}px))`
      break
    }
  }

  bubble.innerHTML = String(value)
}

export default (container: Document | HTMLElement = document) => {
  const ranges = container.querySelectorAll<HTMLDivElement>(`*[${DATA_RANGE}]`)

  if (!ranges.length) return

  ranges.forEach((range) => {
    const wrappers = range.querySelectorAll<HTMLDivElement>(`*[${DATA_RANGE}-wrapper]`)
    const size = Number(range.dataset.range) || 28

    range.style.setProperty('--range-size', `${size / 16}rem`)

    switch (wrappers.length) {
      case 1: {
        const output: HTMLOutputElement | null = range.querySelector(`*[${DATA_RANGE}-output]`)
        const input: HTMLInputElement | null = range.querySelector(`*[${DATA_RANGE}-input]`)
        const progress: HTMLDivElement | null = range.querySelector(`*[${DATA_RANGE}-progress]`)
        const bubble: HTMLOutputElement | null = range.querySelector(`*[${DATA_RANGE}-bubble]`)

        if (!output || !input || !progress || !bubble) {
          handleElementsError()
          return
        }

        const onChange = () => {
          setBubblePosition({ size, number: FIRST, input, progress, bubble })
          output.value = input.value
        }

        onChange()
        input.addEventListener('input', onChange)
        break
      }

      case 2: {
        if (wrappers.length !== 2) return

        const outputs = range.querySelectorAll<HTMLInputElement>(`*[${DATA_RANGE}-output]`)
        const firstOutput: HTMLInputElement | null = outputs[FIRST]
        const lastOutput: HTMLInputElement | null = outputs[LAST]
        const firstWrapper: HTMLDivElement = wrappers[FIRST]
        const lastWrapper: HTMLDivElement = wrappers[LAST]
        const firstInput: HTMLInputElement | null = firstWrapper.querySelector(`*[${DATA_RANGE}-input]`)
        const lastInput: HTMLInputElement | null = lastWrapper.querySelector(`*[${DATA_RANGE}-input]`)
        const firstProgress: HTMLDivElement | null = firstWrapper.querySelector(`*[${DATA_RANGE}-progress]`)
        const lastProgress: HTMLDivElement | null = lastWrapper.querySelector(`*[${DATA_RANGE}-progress]`)
        const firstBubble: HTMLOutputElement | null = firstWrapper.querySelector(`*[${DATA_RANGE}-bubble]`)
        const lastBubble: HTMLOutputElement | null = lastWrapper.querySelector(`*[${DATA_RANGE}-bubble]`)

        if (
          !firstOutput ||
          !lastOutput ||
          !firstInput ||
          !lastInput ||
          !firstProgress ||
          !lastProgress ||
          !firstBubble ||
          !lastBubble
        ) {
          handleElementsError()
          return
        }

        const onChange = () => {
          setBubblePosition({
            size,
            number: FIRST,
            input: firstInput,
            progress: firstProgress,
            bubble: firstBubble
          })
          setBubblePosition({
            size,
            number: LAST,
            input: lastInput,
            progress: lastProgress,
            bubble: lastBubble
          })
        }

        const changeFirstOutput = () => {
          if (Number(firstOutput.value) > Number(lastOutput.value)) {
            firstInput.value = firstOutput.value
            lastOutput.value = firstOutput.value
            lastInput.value = lastOutput.value
          }

          firstInput.value = firstOutput.value
          onChange()
        }

        const changeLastOutput = () => {
          if (Number(lastOutput.value) < Number(firstOutput.value)) {
            lastInput.value = lastOutput.value
            firstOutput.value = lastOutput.value
            firstInput.value = firstOutput.value
          }

          lastInput.value = lastOutput.value
          onChange()
        }

        const changeFirstInput = () => {
          if (Number(firstInput.value) > Number(lastInput.value)) {
            lastInput.value = firstInput.value
            lastOutput.value = lastInput.value
          }

          firstOutput.value = firstInput.value
          onChange()
        }

        const changeLastInput = () => {
          if (Number(lastInput.value) < Number(firstInput.value)) {
            firstInput.value = lastInput.value
            firstOutput.value = firstInput.value
          }

          lastOutput.value = lastInput.value
          onChange()
        }

        firstOutput.value = firstInput.value
        lastOutput.value = lastInput.value
        onChange()
        firstOutput.addEventListener('input', changeFirstOutput)
        lastOutput.addEventListener('input', changeLastOutput)
        firstInput.addEventListener('input', changeFirstInput)
        lastInput.addEventListener('input', changeLastInput)
        break
      }
    }
  })
}
