import React, { useEffect, useState } from 'react'
import { Box, Grid } from '@chakra-ui/react'
import { Tile, TileState } from '../dijkstra/Tile'
import { GridTile } from './GridTile'
import { BOMB_COST, COLS, DEST_COST, EMPTY_COST, Node, ROWS, WALL_COST } from '../dijkstra/Pathfinder'
import { motion } from 'framer-motion'

interface WorldProps {
}

const INITIAL_TILE_STATE: Tile[][] = []

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
    INITIAL_TILE_STATE.push(row)
}

export const World: React.FC<WorldProps> = ({ }) => {
    var _distances: number[][] = Array(ROWS).fill(null).map(() => Array(COLS).fill(1000))
    var _parents: Map<Node, Node> = new Map()
    var _matrix = INITIAL_TILE_STATE

    const [distances, setDistances] = useState<number[][]>(_distances)
    const [parents, setParents] = useState<Map<Node, Node>>(_parents)
    const [matrix, setMatrix] = useState<Tile[][]>(_matrix)



    useEffect(() => {
        _dijkstraShortestPathCostGenerator()
        _getShortestPathSequence()
    }, [distances])

    const _resetDistanceMatrix = (): void => {
        _distances = Array(ROWS).fill(null).map(() => Array(COLS).fill(1000))
    }

    const _resetParentMatrix = () => {
        _parents = new Map()
    }

    const _dijkstraShortestPathCostGenerator = (): void => {
        _resetDistanceMatrix()
        _resetParentMatrix()
        const queue: Node[] = [{ row: 13, col: 10, dist: 0 }]
        _distances[13][10] = 0
        _matrix[13][10].setTileState(TileState.SRC)
        _matrix[13][40].setTileState(TileState.DEST)
        _temporaryWeightedEdges()

        while (queue.length > 0) {
            const u = dequeue(queue)
            const neighbors = getNeighbors(u.row, u.col)
            for (let i = 0; i < neighbors.length; i++) {
                const v = neighbors[i]
                const alt = _distances[u.row][u.col] + v.dist // alt = dist[u] + G.E(u, v)
                if (alt < _distances[v.row][v.col]) {
                    _distances[v.row][v.col] = alt
                    _parents.set(v, u)
                    queue.push(v)
                }
            }
        }
        setDistances(_distances)
        setParents(_parents)
    }

    const _getShortestPathSequence = (): void => {
        const sequence: Node[] = []
        const dest = { row: 13, col: 40 }
    }

    const _temporaryWeightedEdges = (): void => {
        _matrix[8][30].setTileState(TileState.WALL)
        _matrix[9][30].setTileState(TileState.WALL)
        _matrix[10][30].setTileState(TileState.WALL)
        _matrix[11][30].setTileState(TileState.WALL)
        _matrix[12][30].setTileState(TileState.WALL)
        _matrix[13][30].setTileState(TileState.WALL)
        _matrix[14][30].setTileState(TileState.WALL)
        _matrix[15][30].setTileState(TileState.WALL)
        _matrix[8][12].setTileState(TileState.WALL)
        _matrix[9][12].setTileState(TileState.WALL)
        _matrix[10][12].setTileState(TileState.WALL)
        _matrix[11][12].setTileState(TileState.WALL)
        _matrix[12][12].setTileState(TileState.WALL)
        _matrix[13][12].setTileState(TileState.WALL)
        _matrix[14][12].setTileState(TileState.WALL)
        _matrix[15][12].setTileState(TileState.WALL)
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (_matrix[row][col].getTileState() === TileState.WALL) {
                    _matrix[row][col].dist = WALL_COST
                }
                else if (_matrix[row][col].getTileState() === TileState.BOMB) {
                    _matrix[row][col].dist = BOMB_COST
                }
            }
        }
    }

    const dequeue = (queue: Node[]): Node => {
        queue.sort((a, b) => _distances[a.row][a.col] - _distances[b.row][b.col])
        return queue.shift()!
    }

    const getNeighbors = (row: number, col: number): Node[] => {
        const neighbors = []
        if (isValidCell(row - 1, col))
            neighbors.push({ row: row - 1, col: col, dist: _matrix[row - 1][col].dist }) // Up
        if (isValidCell(row + 1, col))
            neighbors.push({ row: row + 1, col: col, dist: _matrix[row + 1][col].dist })
        if (isValidCell(row, col - 1))
            neighbors.push({ row: row, col: col - 1, dist: _matrix[row][col - 1].dist })
        if (isValidCell(row, col + 1))
            neighbors.push({ row: row, col: col + 1, dist: _matrix[row][col + 1].dist })
        return neighbors
    }

    const isValidCell = (row: number, col: number): boolean => row >= 0 && row < ROWS && col >= 0 && col < COLS


    return <Box className='flex justify-center'><Grid templateColumns='repeat(50, 1fr)' className='mx-20 my-10'>
        {_matrix.map((tileRow) => tileRow.map((tile) => <GridTile key={Math.random()}
            parents={parents}
            distances={distances} tile={tile} />))}
    </Grid></Box>

}