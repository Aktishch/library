import { Container } from '@utils'

const COMBINATION_KEYS: string[] = ['s', 't', 'a', 'r', 't']

export default (container: Container = document): void => {
  let status: boolean = true
  let index: number = 0

  container.addEventListener('keyup', ((event: KeyboardEvent): void => {
    if (event.key === COMBINATION_KEYS[index]) {
      if (!status) return

      index++

      if (index === COMBINATION_KEYS.length) {
        alert('Start')
        status = false
        index = 0
      }
    } else {
      index = 0
    }
  }) as EventListener)
}
