import { Container } from '@utils'

export default (container: Container = document): void => {
  const game = container.querySelector('*[data-game]') as HTMLDivElement

  if (!game) return

  const cells: HTMLButtonElement[] = []
  const combinations: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  let player: 'X' | '0' = 'X'
  let over: boolean = false

  const checkWin = (player: string): boolean => {
    return combinations.some((combination: number[]): boolean => {
      return combination.every((index: number): boolean => {
        return cells[index].textContent === player
      })
    })
  }

  const checkDraw = (): boolean => {
    return cells.every((cell: HTMLButtonElement): boolean => {
      return cell.textContent !== ''
    })
  }

  const checkCell = (cell: HTMLButtonElement): void => {
    cell.textContent = player
    cell.disabled = true
  }

  const endGame = (message: string): void => {
    over = true

    window.requestAnimationFrame((): void => {
      window.requestAnimationFrame((): void => {
        alert(message)
      })
    })
  }

  const makeBotMove = (): void => {
    const emptyCells: HTMLButtonElement[] = cells.filter((cell: HTMLButtonElement): boolean => cell.textContent === '')

    if (emptyCells.length > 0 && player === '0') {
      const randomIndex: number = Math.floor(Math.random() * emptyCells.length)
      const cell = emptyCells[randomIndex] as HTMLButtonElement

      checkCell(cell)

      if (checkWin(player)) {
        endGame('Проигрыш!')
        over = true
      } else if (checkDraw()) {
        endGame('Ничья!')
        over = true
      } else {
        player = 'X'
      }
    }
  }

  for (let i: number = 0; i < 9; i++) {
    const cell = document.createElement('button') as HTMLButtonElement

    cell.classList.add('pack', 'pack-xl', 'btn', 'btn-contur', 'active:transform-none')
    cells.push(cell)
    game.appendChild(cell)

    cell.addEventListener('click', ((): void => {
      if (over || cell.textContent !== '' || player !== 'X') return

      checkCell(cell)

      if (checkWin(player)) {
        endGame('Победа!')
        over = true
      } else if (checkDraw()) {
        endGame('Ничья!')
        over = true
      } else {
        player = '0'
        setTimeout(makeBotMove, 500)
      }
    }) as EventListener)
  }
}
