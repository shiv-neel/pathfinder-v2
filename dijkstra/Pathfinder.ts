import { Tile, TileState } from './Tile'

export const ROWS = 25
export const COLS = 58

export const INITIAL_SRC_ROW = ROWS / 2 + 1
export const INITIAL_SRC_COL = COLS * 0.1

export const INITIAL_DEST_ROW = ROWS / 2 + 1
export const INITIAL_DEST_COL = COLS * 0.9
 
export const EMPTY_COST = 5
export const WALL_COST = 200
export const BOMB_COST = 10
export const DEST_COST = 20

export const INITIAL_MATRIX_STATE: Tile[][] = []

for (let j = 0; j < ROWS; j++) {
    const row: Tile[] = []
    for (let i = 0; i < COLS; i++) {
            row.push(new Tile(TileState.UNVISITED, j, i, EMPTY_COST))
    }
    INITIAL_MATRIX_STATE.push(row)
}


export const getNeighbors = (row: number, col: number, matrix: Tile[][]): Tile[] => {
  const neighbors = []
  if (isValidCell(row - 1, col))
      neighbors.push(new Tile(TileState.UNVISITED, row - 1, col, matrix[row - 1][col].dist)) // Up
  if (isValidCell(row + 1, col))
      neighbors.push(new Tile(TileState.UNVISITED, row + 1, col, matrix[row + 1][col].dist))
  if (isValidCell(row, col - 1))
      neighbors.push(new Tile(TileState.UNVISITED, row, col - 1, matrix[row][col - 1].dist))
  if (isValidCell(row, col + 1))
      neighbors.push(new Tile(TileState.UNVISITED, row, col + 1, matrix[row][col + 1].dist))
  return neighbors
}

const isValidCell = (row: number, col: number): boolean => row >= 0 && row < ROWS && col >= 0 && col < COLS

export const getNodeFromIndex = (index: number): Tile => {
    const row = Math.floor(index / COLS)
    const col = index % COLS
    return new Tile(TileState.UNVISITED, row, col)
}

export const getIndexFromNode = (tile: Tile): number => tile.row * COLS + tile.col