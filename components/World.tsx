import React, { useEffect, useState } from 'react'
import { Box, Grid } from '@chakra-ui/react'
import { Tile, TileState } from '../dijkstra/Tile'
import { GridTile } from './GridTile'
import { BOMB_COST, COLS, INITIAL_MATRIX_STATE, Node, ROWS, WALL_COST, getNeighbors } from '../dijkstra/Pathfinder'
import { motion } from 'framer-motion'

interface WorldProps {
}



export const World: React.FC<WorldProps> = ({ }) => {
    var _distances: number[][] = Array(ROWS).fill(null).map(() => Array(COLS).fill(1000))
    var _parents: Node[] = []
    var _matrix = INITIAL_MATRIX_STATE
    var _visitedSet: Node[] = []

    const [distances, setDistances] = useState<number[][]>(_distances)
    const [parents, setParents] = useState<Node[]>(_parents)
    const [matrix, setMatrix] = useState<Tile[][]>(_matrix)
    const [src, setSrc] = useState<Node>({ row: 13, col: 10 })
    const [dest, setDest] = useState<Node>({ row: 13, col: 40 })



    useEffect(() => {
        _dijkstraShortestPathCostGenerator(src.row, src.col, dest.row, dest.col)
        _getShortestPathSequence(src.row, src.col, dest.row, dest.col)
    }, [])

    const _resetDistanceMatrix = (): void => {
        _distances = Array(ROWS).fill(null).map(() => Array(COLS).fill(1000))
    }

    const _resetParentMatrix = () => {
        _parents = new Array<Node>()
    }

    const _dijkstraShortestPathCostGenerator = (srcRow: number, srcCol: number, destRow: number, destCol: number): void => {
        _resetDistanceMatrix()
        _resetParentMatrix()
        const queue: Node[] = [{ row: srcRow, col: srcCol, dist: 0 }]
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
                    if (_matrix[v.row][v.col].getTileState() !== TileState.WALL)
                        _matrix[v.row][v.col].setTileState(TileState.VISITED)
                    queue.push(v)
                    if (!_visitedSet.filter((node) => node.row === v.row && node.col === v.col).length)
                        _visitedSet.push(v)
                    if (v.row === destRow && v.col === destCol) {
                        _matrix[v.row][v.col].setTileState(TileState.DEST)
                        setDistances(_distances)
                        setParents(_parents)
                        return
                    }
                }
            }
        }
        setDistances(_distances)
        setParents(_parents)
    }

    const _getShortestPathSequence = (srcRow: number, srcCol: number, destRow: number, destCol: number): void => {
        const sequence: Node[] = []
        let current = _parents[destRow * COLS + destCol]
        while (current && (current.row !== srcRow || current.col !== srcCol)) {
            sequence.push(current)
            _matrix[current.row][current.col].setTileState(TileState.PATH)
            current = _parents[current.row * COLS + current.col]
        }
        sequence.reverse()
        _animateDijkstra(sequence)
    }

    const _animateDijkstra = (sequence: Node[]): void => {
        for (let i = 0; i <= _visitedSet.length; i++) {
            if (i === _visitedSet.length) {
                setTimeout(() => {
                    _animateShortestPath(sequence)
                }, 10 * i)
                return
            }
            setTimeout(() => {
                const node = _visitedSet[i]
                document.getElementById(`node-${node.row}-${node.col}`)!.className =
                    'node node-visited'
            }, 10 * i)
        }
    }

    const _animateShortestPath = (sequence: Node[]) => {
        for (let i = 0; i < sequence.length; i++) {
            setTimeout(() => {
                const node = sequence[i]
                document.getElementById(`node-${node.row}-${node.col}`)!.className =
                    'node node-shortest-path'
            }, 50 * i)
        }
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


    return <Box className='flex justify-center'>
        <Grid templateColumns='repeat(50, 1fr)' className='mx-20 my-10'>
            {_matrix.map((tileRow) => tileRow.map((tile) => <GridTile key={Math.random()}
                matrix={matrix}
                parents={parents}
                distances={distances} tile={tile} />))}
        </Grid>
    </Box>

}