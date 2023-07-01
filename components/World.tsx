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

    const [distances, setDistances] = useState<number[][]>(_distances)
    const [parents, setParents] = useState<Node[]>(_parents)
    const [matrix, setMatrix] = useState<Tile[][]>(_matrix)



    useEffect(() => {
        _dijkstraShortestPathCostGenerator()
        _getShortestPathSequence()
    }, [])

    const _resetDistanceMatrix = (): void => {
        _distances = Array(ROWS).fill(null).map(() => Array(COLS).fill(1000))
    }

    const _resetParentMatrix = () => {
        _parents = new Array<Node>()
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
            const neighbors = getNeighbors(u.row, u.col, _matrix)
            for (let i = 0; i < neighbors.length; i++) {
                const v = neighbors[i]
                const alt = _distances[u.row][u.col] + v.dist // alt = dist[u] + G.E(u, v)
                if (alt < _distances[v.row][v.col]) {
                    _distances[v.row][v.col] = alt
                    _parents[v.row * COLS + v.col] = u
                    queue.push(v)
                }
            }
        }
        setDistances(_distances)
        setParents(_parents)
    }

    const _getShortestPathSequence = (): void => {
        const sequence: Node[] = []
        let current = _parents[13 * COLS + 40]
        while (current && (current.row !== 13 || current.col !== 10)) {
            sequence.push(current)
            _matrix[current.row][current.col].setTileState(TileState.PATH)
            current = _parents[current.row * COLS + current.col]
        }
        console.log(sequence)

        // _animateShortestPath(sequence)
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
                parents={parents}
                distances={distances} tile={tile} />))}
        </Grid>
    </Box>

}