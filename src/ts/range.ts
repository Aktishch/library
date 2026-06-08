import { Container, getData, isEn, logError } from '@utils'

type Wrapper = HTMLDivElement | null
type Output = HTMLOutputElement | null
type Input = HTMLInputElement | null
type Progress = HTMLDivElement | null
type Bubble = HTMLOutputElement | null

interface BubblePosition {
  size: number
  number: number
  input: HTMLInputElement
  progress: HTMLDivElement
  bubble: HTMLOutputElement
}

const DATA_RANGE: string = getData('range')

const handleElementsError = (): void => {
  logError(
    isEn
      ? `The ${DATA_RANGE} does not have a ${DATA_RANGE}-(output, input, progress, bubble) child element`
      : `У ${DATA_RANGE} отсутствует дочерний элемент ${DATA_RANGE}-(output, input, progress, bubble)`
  )
}

const setBubblePosition = ({ size, number, input, progress, bubble }: BubblePosition): void => {
  const percent: number = size / 100
  const half: number = size / 2
  const value: number = Number(input.value)
  const min: number = Number(input.min) || 0
  const max: number = Number(input.max) || 100
  let step: number

  switch (number) {
    case 0: {
      step = ((value - min) * 100) / (max - min)
      progress.style.left = '0'
      bubble.style.left = `calc(${step}% - (${step * percent}px))`
      progress.style.width = `calc(${step}% + (${half - step * percent}px))`
      break
    }

    case 1: {
      step = ((max - value) * 100) / (max - min)
      progress.style.right = '0'
      bubble.style.right = `calc(${step}% - (${step * percent}px))`
      progress.style.width = `calc(${step}% + (${half - step * percent}px))`
      break
    }
  }

  bubble.innerHTML = String(value)
}

export default (container: Container = document): void => {
  const ranges: NodeListOf<HTMLDivElement> = container.querySelectorAll(`*[${DATA_RANGE}]`)

  if (!ranges.length) return

  ranges.forEach((range: HTMLDivElement): void => {
    const wrappers: NodeListOf<HTMLDivElement> = range.querySelectorAll(`*[${DATA_RANGE}-wrapper]`)
    const size: number = Number(range.dataset.range) || 28
    const first: number = 0
    const last: number = 1

    range.style.setProperty('--bubble-size', `${size / 16}rem`)

    switch (wrappers.length) {
      case 1: {
        const output: Output = range.querySelector(`*[${DATA_RANGE}-output]`)
        const input: Input = range.querySelector(`*[${DATA_RANGE}-input]`)
        const progress: Progress = range.querySelector(`*[${DATA_RANGE}-progress]`)
        const bubble: Bubble = range.querySelector(`*[${DATA_RANGE}-bubble]`)

        if (!output || !input || !progress || !bubble) {
          handleElementsError()
          return
        }

        const onChange = (): void => {
          setBubblePosition({ size, number: first, input, progress, bubble })
          output.value = input.value
        }

        onChange()
        input.addEventListener('input', onChange as EventListener)
        break
      }

      case 2: {
        const firstWrapper: Wrapper = wrappers[first]
        const lastWrapper: Wrapper = wrappers[last]

        if (!firstWrapper || !lastWrapper) return

        const outputs: NodeListOf<HTMLInputElement> = range.querySelectorAll(`*[${DATA_RANGE}-output]`)
        const firstOutput: Input = outputs[first]
        const lastOutput: Input = outputs[last]
        const firstInput: Input = firstWrapper.querySelector(`*[${DATA_RANGE}-input]`)
        const lastInput: Input = lastWrapper.querySelector(`*[${DATA_RANGE}-input]`)
        const firstProgress: Progress = firstWrapper.querySelector(`*[${DATA_RANGE}-progress]`)
        const lastProgress: Progress = lastWrapper.querySelector(`*[${DATA_RANGE}-progress]`)
        const firstBubble: Bubble = firstWrapper.querySelector(`*[${DATA_RANGE}-bubble]`)
        const lastBubble: Bubble = lastWrapper.querySelector(`*[${DATA_RANGE}-bubble]`)

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

        const onChange = (): void => {
          setBubblePosition({
            size,
            number: first,
            input: firstInput,
            progress: firstProgress,
            bubble: firstBubble
          })
          setBubblePosition({
            size,
            number: last,
            input: lastInput,
            progress: lastProgress,
            bubble: lastBubble
          })
        }

        firstOutput.value = firstInput.value
        lastOutput.value = lastInput.value
        onChange()

        firstOutput.addEventListener('input', ((): void => {
          if (Number(firstOutput.value) > Number(lastOutput.value)) {
            firstInput.value = firstOutput.value
            lastOutput.value = firstOutput.value
            lastInput.value = lastOutput.value
          }

          firstInput.value = firstOutput.value
          onChange()
        }) as EventListener)

        lastOutput.addEventListener('input', ((): void => {
          if (Number(lastOutput.value) < Number(firstOutput.value)) {
            lastInput.value = lastOutput.value
            firstOutput.value = lastOutput.value
            firstInput.value = firstOutput.value
          }

          lastInput.value = lastOutput.value
          onChange()
        }) as EventListener)

        firstInput.addEventListener('input', ((): void => {
          if (Number(firstInput.value) > Number(lastInput.value)) {
            lastInput.value = firstInput.value
            lastOutput.value = lastInput.value
          }

          firstOutput.value = firstInput.value
          onChange()
        }) as EventListener)

        lastInput.addEventListener('input', ((): void => {
          if (Number(lastInput.value) < Number(firstInput.value)) {
            firstInput.value = lastInput.value
            firstOutput.value = firstInput.value
          }

          lastOutput.value = lastInput.value
          onChange()
        }) as EventListener)

        break
      }
    }
  })
}
