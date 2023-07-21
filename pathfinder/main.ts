import { Tile, TileState } from './Tile'

export const ROWS = 24
export var COLS = 58

export const INITIAL_SRC_ROW = ROWS / 2 + 1
export const INITIAL_SRC_COL = COLS * 0.1

export const INITIAL_DEST_ROW = ROWS / 2 + 1
export const INITIAL_DEST_COL = COLS * 0.9
 
export const EMPTY_COST = 5
export const WALL_COST = Infinity
export const DEST_COST = 20

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

export const isVisited = (visitedSet: Tile[], t: Tile): boolean => {
    return !!visitedSet.find(tile => tile.row === t.row && tile.col === t.col)
}

export const getNodeFromIndex = (index: number): Tile => {
    const row = Math.floor(index / COLS)
    const col = index % COLS
    return new Tile(TileState.UNVISITED, row, col)
}

export const getIndexFromNode = (tile: Tile): number => tile.row * COLS + tile.col

export const dequeue = (queue: Tile[], distances: number[][]): Tile => {
    queue.sort((a, b) => distances[a.row][a.col] - distances[b.row][b.col])
    return queue.shift()!
}

export const speedNormalizer = [50, 25, 10, 5, 1]