import React, { useEffect, useState } from 'react'
import { Box, Grid } from '@chakra-ui/react'
import { Tile, TileState } from '../dijkstra/Tile'
import { GridTile } from './GridTile'
import { BOMB_COST, COLS, INITIAL_MATRIX_STATE, ROWS, WALL_COST, getNeighbors } from '../dijkstra/Pathfinder'
import { motion } from 'framer-motion'

interface WorldProps {
}



export const World: React.FC<WorldProps> = ({ }) => {
    var _distances: number[][] = Array(ROWS).fill(null).map(() => Array(COLS).fill(1000))
    var _parents: Tile[] = []
    var _matrix = INITIAL_MATRIX_STATE
    var _visitedSet: Tile[] = []

    const [distances, setDistances] = useState<number[][]>(_distances)
    const [parents, setParents] = useState<Tile[]>(_parents)
    const [matrix, setMatrix] = useState<Tile[][]>(_matrix)
    const [src, setSrc] = useState<Tile>(new Tile(TileState.SRC, 13, 10))
    const [dest, setDest] = useState<Tile>(new Tile(TileState.DEST, 13, 40))



    useEffect(() => {
        _dijkstraShortestPathCostGenerator(src.row, src.col, dest.row, dest.col)
        _getShortestPathSequence(src.row, src.col, dest.row, dest.col)
    }, [])

    const _resetDistanceMatrix = (): void => {
        _distances = Array(ROWS).fill(null).map(() => Array(COLS).fill(1000))
    }

    const _resetParentMatrix = () => {
        _parents = new Array<Tile>()
    }

    const _dijkstraShortestPathCostGenerator = (srcRow: number, srcCol: number, destRow: number, destCol: number): void => {
        _resetDistanceMatrix()
        _resetParentMatrix()
        const queue: Tile[] = [new Tile(TileState.UNVISITED, srcRow, srcCol)]
        _distances[srcRow][srcCol] = 0
        _matrix[srcRow][srcCol].setTileState(TileState.SRC)
        _matrix[destRow][destCol].setTileState(TileState.DEST)
        _temporaryWeightedEdges()

        while (queue.length > 0) {
            const u = dequeue(queue)
            const neighbors = getNeighbors(u.row, u.col, _matrix)
            for (let i = 0; i < neighbors.length; i++) {
                const v = neighbors[i]
                const alt = _distances[u.row][u.col] + v.dist! // alt = dist[u] + G.E(u, v)
                if (alt < _distances[v.row][v.col]) {

                    _distances[v.row][v.col] = alt
                    _parents[v.row * COLS + v.col] = u
                    if (_matrix[v.row][v.col].isWall)
                        _matrix[v.row][v.col].setTileState(TileState.VISITED)

                    if (v.row === destRow && v.col === destCol) {
                        setDistances(_distances)
                        setParents(_parents)
                        return
                    }
                    queue.push(v)
                    if (!_visitedSet.filter((node) => node.row === v.row && node.col === v.col).length)
                        _visitedSet.push(v)
                }
            }
        }
        setDistances(_distances)
        setParents(_parents)
    }

    const _getShortestPathSequence = (srcRow: number, srcCol: number, destRow: number, destCol: number): void => {
        const sequence: Tile[] = []
        let current = _parents[destRow * COLS + destCol]
        while (current && (current.row !== srcRow || current.col !== srcCol)) {
            sequence.push(current)
            _matrix[current.row][current.col].setTileState(TileState.PATH)
            current = _parents[current.row * COLS + current.col]
        }
        sequence.reverse()
        _animateDijkstra(sequence)
    }

    const _animateDijkstra = (sequence: Tile[]): void => {
        for (let i = 0; i <= _visitedSet.length; i++) {
            if (i === _visitedSet.length) {
                setTimeout(() => {
                    _animateShortestPath(sequence)
                }, 10 * i)
                return
            }
            setTimeout(() => {
                const node = _visitedSet[i]
                if (!_matrix[node.row][node.col].isWall)
                    document.getElementById(`node-${node.row}-${node.col}`)!.className =
                        'node node-visited'
            }, 10 * i)
        }
    }

    const _animateShortestPath = (sequence: Tile[]) => {
        for (let i = 0; i < sequence.length; i++) {
            setTimeout(() => {
                const node = sequence[i]
                document.getElementById(`node-${node.row}-${node.col}`)!.className =
                    'node node-shortest-path'
            }, 50 * i)
        }
    }

    const _temporaryWeightedEdges = (): void => {
        _matrix[8][30].setIsWall(true)
        _matrix[9][30].setIsWall(true)
        _matrix[10][30].setIsWall(true)
        _matrix[11][30].setIsWall(true)
        _matrix[12][30].setIsWall(true)
        _matrix[13][30].setIsWall(true)
        _matrix[14][30].setIsWall(true)
        _matrix[15][30].setIsWall(true)
        _matrix[8][12].setIsWall(true)
        _matrix[9][12].setIsWall(true)
        _matrix[10][12].setIsWall(true)
        _matrix[11][12].setIsWall(true)
        _matrix[12][12].setIsWall(true)
        _matrix[13][12].setIsWall(true)
        _matrix[14][12].setIsWall(true)
        _matrix[15][12].setIsWall(true)
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (_matrix[row][col].isWall) {
                    _matrix[row][col].dist = WALL_COST
                }
            }
        }
    }

    const dequeue = (queue: Tile[]): Tile => {
        queue.sort((a, b) => _distances[a.row][a.col] - _distances[b.row][b.col])
        return queue.shift()!
    }


    return <Box className='flex justify-center'>
        <Grid templateColumns='repeat(50, 1fr)' className='mx-20 my-10'>
            {_matrix.map((tileRow) => tileRow.map((tile) => <GridTile key={Math.random()}
                matrix={matrix}
                parents={parents}
                distances={distances} tile={tile} />))}
        </Grid>
    </Box>

}