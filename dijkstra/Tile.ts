export enum TileState {
    SRC,
    DEST,
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

    setIsWall(isWall: boolean) {
        this.isWall = isWall
    }

    toggleWallState() {
        this.isWall = !this.isWall
    }

}