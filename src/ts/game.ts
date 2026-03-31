export default (): void => {
  const game = document.querySelector('*[data-game]') as HTMLDivElement

  if (!game) return

  const cells: HTMLButtonElement[] = []
  let player: string = 'X'
  let over: boolean = false

  const checkWin = (player: string): boolean => {
    const combinations: number[][] = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    return combinations.some((combination: number[]): boolean => {
      return combination.every((index: number): boolean => cells[index].textContent === player)
    })
  }

  const checkDraw = (): boolean => cells.every((cell: HTMLButtonElement): boolean => cell.textContent !== '')

  const checkCell = (cell: HTMLButtonElement): void => {
    cell.textContent = player
    cell.disabled = true
  }

  const makeBotMove = (): void => {
    const emptyCells: HTMLButtonElement[] = cells.filter((cell: HTMLButtonElement): boolean => cell.textContent === '')

    if (emptyCells.length > 0 && player === '0') {
      const randomIndex: number = Math.floor(Math.random() * emptyCells.length)
      const cell = emptyCells[randomIndex] as HTMLButtonElement

      checkCell(cell)

      if (checkWin(player)) {
        alert('Проигрыш!')
        over = true
      } else if (checkDraw()) {
        alert('Ничья!')
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
      if (cell.textContent === '' && player === 'X' && !over) {
        checkCell(cell)

        if (checkWin(player)) {
          alert('Победа!')
          over = true
        } else if (checkDraw()) {
          alert('Ничья!')
          over = true
        } else {
          player = '0'
          setTimeout(makeBotMove, 500)
        }
      }
    }) as EventListener)
  }
}
