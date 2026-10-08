import { getData } from '@utils'

const DATA_QUIZ = getData('quiz')

export const checkQuizSlide = (slide: HTMLElement) => {
  const quiz: HTMLElement | null = slide.closest(`[${DATA_QUIZ}]`)

  if (!quiz) return

  const inputs = [
    ...slide.querySelectorAll('input'),
    ...slide.querySelectorAll('select'),
    ...slide.querySelectorAll('textarea')
  ]
  let active = false

  if (slide.dataset.quizSlide === 'empty' || inputs.length === 0) {
    active = true
  } else {
    inputs.forEach((input) => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        if ((input as HTMLInputElement).checked !== false) active = true
      } else if (input.value.length !== 0) {
        active = true
      }
    })
  }

  quiz.dataset.quiz = active ? '' : 'stop'
}

const checkQuizInputs = (event: Event) => {
  const slide: HTMLDivElement | null = (event.target as HTMLElement).closest(`[${DATA_QUIZ}-slide]`)

  if (slide) {
    checkQuizSlide(slide)
  }
}

export default (container: Document | HTMLElement = document) => {
  container.addEventListener('input', checkQuizInputs)
}
