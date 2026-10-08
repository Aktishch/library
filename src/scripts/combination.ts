const COMBINATION_OPTIONS = {
  keys: ['s', 't', 'a', 'r', 't'],
  status: true,
  index: 0
}

const setCombination = (event: KeyboardEvent) => {
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

export default (container: Document | HTMLElement = document) => {
  container.addEventListener('keyup', setCombination as EventListener)
}
