import { Container } from '@utils'

export default (container: Container = document): void => {
  const keys: string[] = ['s', 't', 'a', 'r', 't']
  let status: boolean = true
  let index: number = 0

  container.addEventListener('keyup', ((event: KeyboardEvent): void => {
    if (event.key === keys[index]) {
      if (!status) return

      index++

      if (index === keys.length) {
        alert('Start')
        status = false
        index = 0
      }
    } else {
      index = 0
    }
  }) as EventListener)
}
