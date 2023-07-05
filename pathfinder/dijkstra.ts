import { Tile, TileState } from './Tile'
import { COLS, INITIAL_MATRIX_STATE, PathGeneratorReturnStruct, ROWS, defaultPathGeneratorReturnStruct, dequeue, getNeighbors } from './main'

var distances: number[][] = Array(ROWS).fill(null).map(() => Array(COLS).fill(1000))
var parents: Tile[] = new Array(ROWS * COLS)
var visitedSet: Tile[] = new Array(ROWS * COLS)


const _resetDistanceMatrix = (): void => {
    distances = Array(ROWS).fill(null).map(() => Array(COLS).fill(1000))
}

const _resetParentMatrix = () => {
    parents = new Array<Tile>()
}

export const dijkstraShortestPathCostGenerator = (matrix: Tile[][], srcRow: number, srcCol: number, destRow: number, destCol: number
    ): PathGeneratorReturnStruct => {
        _resetDistanceMatrix()
        _resetParentMatrix()
    const queue: Tile[] = [new Tile(TileState.UNVISITED, srcRow, srcCol)]
    distances[srcRow][srcCol] = 0

    while (queue.length > 0) {
        const u = dequeue(queue, distances)
        if (u.isWall) continue
        const neighbors = getNeighbors(u.row, u.col, matrix)
        for (let i = 0; i < neighbors.length; i++) {
            const v = neighbors[i]
            const alt = distances[u.row][u.col] + v.dist! // alt = dist[u] + G.E(u, v)
            if (alt < distances[v.row][v.col]) {
                distances[v.row][v.col] = alt
                parents[v.row * COLS + v.col] = u
                if (matrix[v.row][v.col].isWall)
                    matrix[v.row][v.col].setTileState(TileState.VISITED)

                if (v.row === destRow && v.col === destCol) {
                    return defaultPathGeneratorReturnStruct
                }
                queue.push(v)
                if (!visitedSet.filter((node) => node.row === v.row && node.col === v.col).length)
                    visitedSet.push(v)
            }
        }
    }

    return {
        matrix, distances: distances, parents: parents, visitedSet: visitedSet
    }
}