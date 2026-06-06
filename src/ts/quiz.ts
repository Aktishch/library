import { Container, getData } from '@utils'

type Input = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

const DATA_QUIZ: string = getData('quiz')

export const checkQuizSlide = (slide: HTMLElement): void => {
  const quiz: HTMLElement = slide.closest(`[${DATA_QUIZ}]`) as HTMLElement
  const inputs: Input[] = [
    ...slide.querySelectorAll('input'),
    ...slide.querySelectorAll('select'),
    ...slide.querySelectorAll('textarea')
  ]
  let active: boolean = false

  if (slide.dataset.quizSlide === 'empty' || inputs.length === 0) {
    active = true
  } else {
    inputs.forEach((input: Input): void => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        if ((input as HTMLInputElement).checked !== false) active = true
      } else if (input.value.length !== 0) {
        active = true
      }
    })
  }

  quiz.dataset.quiz = active ? '' : 'stop'
}

const checkQuizInputs = (event: Event): void => {
  const slide: HTMLDivElement | null = (event.target as HTMLElement).closest(`[${DATA_QUIZ}-slide]`)

  if (slide) {
    checkQuizSlide(slide)
  }
}

export default (container: Container = document): void => {
  container.addEventListener('input', checkQuizInputs as EventListener)
}
