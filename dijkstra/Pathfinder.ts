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
