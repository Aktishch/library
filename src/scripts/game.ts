import { Container, getData } from '@utils'

const DATA_GAME = getData('game')
const CELL_CLASSNAMES = ['aspect-square', 'btn', 'btn-contur', 'active:translate-0']

export default (container: Container = document) => {
  const game: HTMLDivElement | null = container.querySelector(`*[${DATA_GAME}]`)

  if (!game) return

  const cells: HTMLButtonElement[] = []
  const combinations = [
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
  let over = false

  const checkWin = (player: string) => {
    return combinations.some((combination) => {
      return combination.every((index) => {
        return cells[index].textContent === player
      })
    })
  }

  const checkDraw = () => {
    return cells.every((cell) => {
      return cell.textContent !== ''
    })
  }

  const checkCell = (cell: HTMLButtonElement) => {
    cell.textContent = player
    cell.disabled = true
  }

  const endGame = (message: string) => {
    over = true

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        alert(message)
      })
    })
  }

  const makeBotMove = () => {
    const emptyCells = cells.filter((cell) => {
      return cell.textContent === ''
    })

    if (emptyCells.length > 0 && player === '0') {
      const randomIndex = Math.floor(Math.random() * emptyCells.length)
      const cell = emptyCells[randomIndex]

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

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button')

    const onClickCell = () => {
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
    }

    cell.classList.add(...CELL_CLASSNAMES)
    cells.push(cell)
    game.appendChild(cell)
    cell.addEventListener('click', onClickCell)
  }
}
