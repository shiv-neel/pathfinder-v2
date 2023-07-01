export enum TileState {
    EMPTY,
    SRC,
    DEST,
    WALL,
    BOMB,
    VISITED,
    PATH
}

export class Tile {
    tileState: TileState
    row: number
    col: number
    dist: number
    visited?: boolean
    inPath?: boolean

    constructor(tileState: TileState,  r: number, c: number, dist: number, visited?: boolean, inPath?: boolean, ) {
        this.tileState = tileState
        this.visited = visited
        this.inPath = inPath
        this.row = r
        this.col = c
        this.dist = dist
    }

    getTileState(): TileState {
        return this.tileState
    }

    setTileState(tileState: TileState) {
        this.tileState = tileState
    }

}