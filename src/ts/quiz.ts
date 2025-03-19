export type QuizInput = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export const checkQuizSlide = (slide: HTMLElement): void => {
  const quiz = slide.closest('[data-quiz]') as HTMLElement
  const inputs: QuizInput[] = [
    ...slide.querySelectorAll('input'),
    ...slide.querySelectorAll('select'),
    ...slide.querySelectorAll('textarea'),
  ]
  let active: boolean = false

  if (inputs.length === 0) {
    active = true
  } else {
    inputs.forEach((input: QuizInput): void => {
      if (!input) return

      if (input.type === 'checkbox' || input.type === 'radio') {
        const toggle = input as HTMLInputElement

        if (toggle.checked !== false) active = true
      } else if (input.value.length !== 0) {
        active = true
      }
    })
  }

  quiz.dataset.quiz = active ? '' : 'stop'
}

export default (): void => {
  document.addEventListener('input', ((event: InputEvent): void => {
    const slide = (event.target as QuizInput).closest('[data-quiz-slide]') as HTMLElement

    if (slide) checkQuizSlide(slide)
  }) as EventListener)
}
