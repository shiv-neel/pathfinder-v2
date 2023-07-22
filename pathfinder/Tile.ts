import { WALL_COST } from './main'

export enum TileState {
    SRC,
    DEST,
    BOMB,
    UNVISITED,
    VISITED,
    PATH
}

export class Tile {
    tileState: TileState
    row: number
    col: number
    dist: number
    isWall: boolean

    constructor(tileState: TileState, row: number, col: number, dist: number = 0, isWall: boolean = false) {
        this.tileState = tileState
        this.row = row
        this.col = col
        this.dist = dist
        this.isWall = isWall
    }

    getRow(): number {
        return this.row
    }

    getCol(): number {
        return this.col
    }

    getDist(): number {
        return this.dist
    }

    setTileState(tileState: TileState) {
        this.tileState = tileState
    }

    public setIsWall(isWall: boolean) {
        this.isWall = isWall
    }

    public setDist(dist: number) {
        this.dist = dist
    }

    toggleWallState() {
        if (this.isWall) {
            this.isWall = false
        }
        else {
            this.isWall = true
        }
    }

}