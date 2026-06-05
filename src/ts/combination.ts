import { Container } from '@utils'

interface CombinationOptions {
  keys: string[]
  status: boolean
  index: number
}

const COMBINATION_OPTIONS: CombinationOptions = {
  keys: ['s', 't', 'a', 'r', 't'],
  status: true,
  index: 0
}

const setCombination = (event: KeyboardEvent): void => {
  if (event.key === COMBINATION_OPTIONS.keys[COMBINATION_OPTIONS.index]) {
    if (!COMBINATION_OPTIONS.status) return

    COMBINATION_OPTIONS.index++

    if (COMBINATION_OPTIONS.index === COMBINATION_OPTIONS.keys.length) {
      alert('Start')
      COMBINATION_OPTIONS.status = false
      COMBINATION_OPTIONS.index = 0
    }
  } else {
    COMBINATION_OPTIONS.index = 0
  }
}

export default (container: Container = document): void => {
  container.addEventListener('keyup', setCombination as EventListener)
}
