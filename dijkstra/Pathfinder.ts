import { Tile, TileState } from './Tile'

export const ROWS = 25
export const COLS = 50
 
export const EMPTY_COST = 5
export const WALL_COST = 200
export const BOMB_COST = 10
export const DEST_COST = 20

export interface Node {
    row: number
    col: number
    dist: number
}

export const INITIAL_MATRIX_STATE: Tile[][] = []

for (let j = 0; j < ROWS; j++) {
    const row: Tile[] = []

    for (let i = 0; i < COLS; i++) {
        if (j === ROWS / 2 + 1) {
            if (i === COLS * 0.1) {
                row.push(new Tile(TileState.SRC, j, i, EMPTY_COST))
            }
            else if (i === COLS * 0.9) {
                row.push(new Tile(TileState.DEST, j, i, DEST_COST))
            }
        }
        else {
            row.push(new Tile(TileState.EMPTY, j, i, EMPTY_COST))
        }
    }
    INITIAL_MATRIX_STATE.push(row)
}


export const getNeighbors = (row: number, col: number, matrix: Tile[][]): Node[] => {
  const neighbors = []
  if (isValidCell(row - 1, col))
      neighbors.push({ row: row - 1, col: col, dist: matrix[row - 1][col].dist }) // Up
  if (isValidCell(row + 1, col))
      neighbors.push({ row: row + 1, col: col, dist: matrix[row + 1][col].dist })
  if (isValidCell(row, col - 1))
      neighbors.push({ row: row, col: col - 1, dist: matrix[row][col - 1].dist })
  if (isValidCell(row, col + 1))
      neighbors.push({ row: row, col: col + 1, dist: matrix[row][col + 1].dist })
  return neighbors
}

const isValidCell = (row: number, col: number): boolean => row >= 0 && row < ROWS && col >= 0 && col < COLS

export const getNodeFromIndex = (index: number): Node => {
    const row = Math.floor(index / COLS)
    const col = index % COLS
    return { row, col, dist: 0 }
}

export const getIndexFromNode = (node: Node): number => node.row * COLS + node.col