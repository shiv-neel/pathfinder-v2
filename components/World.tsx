import React, { use, useContext, useEffect, useState } from 'react'
import { Box, Button, Grid, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { Tile, TileState } from '../dijkstra/Tile'
import { GridTile } from './GridTile'
import { BOMB_COST, COLS, INITIAL_MATRIX_STATE, ROWS, WALL_COST, getNeighbors } from '../dijkstra/Pathfinder'
import { motion } from 'framer-motion'
import { AppContext } from './AppContext'
import { BiCheck, BiChevronDown } from 'react-icons/bi'
import { Algo } from '../models/types'
import { Toolbar } from './Toolbar'

interface WorldProps {
    isShiftKeyPressed: boolean
}



export const World: React.FC<WorldProps> = ({ isShiftKeyPressed }) => {
    var _distances: number[][] = Array(ROWS).fill(null).map(() => Array(COLS).fill(1000))
    var _parents: Tile[] = []
    var _matrix = INITIAL_MATRIX_STATE
    var _visitedSet: Tile[] = []


    const [src, setSrc] = useState<Tile>(new Tile(TileState.SRC, 13, 10))
    const [dest, setDest] = useState<Tile>(new Tile(TileState.DEST, 15, 15))
    const [algo, setAlgo] = useState<Algo>(Algo.DIJKSTRA)
    const { isVisualizing, setIsVisualizing, resetBoard, setResetBoard } = useContext(AppContext)

    _matrix[src.row][src.col].setTileState(TileState.SRC)
    _matrix[dest.row][dest.col].setTileState(TileState.DEST)

    useEffect(() => {
        if (!isVisualizing) return
        _dijkstraShortestPathCostGenerator()
        _getShortestPathSequence()
    }, [isVisualizing])

    useEffect(() => {
        if (!resetBoard) return
        _resetMatrix()
        _resetDistanceMatrix()
        _resetParentMatrix()
        setResetBoard(false)
    }, [resetBoard])


    const _resetMatrix = (): void => {
        _matrix = INITIAL_MATRIX_STATE
        _matrix[src.row][src.col].setTileState(TileState.SRC)
        _matrix[dest.row][dest.col].setTileState(TileState.DEST)

    }

    const _resetDistanceMatrix = (): void => {
        _distances = Array(ROWS).fill(null).map(() => Array(COLS).fill(1000))
    }

    const _resetParentMatrix = () => {
        _parents = new Array<Tile>()
    }

    const _dijkstraShortestPathCostGenerator = (): void => {
        _resetDistanceMatrix()
        _resetParentMatrix()

        const srcRow = src.row
        const srcCol = src.col
        const destRow = dest.row
        const destCol = dest.col

        const queue: Tile[] = [new Tile(TileState.UNVISITED, srcRow, srcCol)]
        _distances[srcRow][srcCol] = 0
        // _temporaryWeightedEdges()

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
                        return
                    }
                    queue.push(v)
                    if (!_visitedSet.filter((node) => node.row === v.row && node.col === v.col).length)
                        _visitedSet.push(v)
                }
            }
        }
    }

    const _getShortestPathSequence = (): void => {
        const srcRow = src.row
        const srcCol = src.col
        const destRow = dest.row
        const destCol = dest.col

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

    const _animateDijkstra = (sequence: Tile[]) => {
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


    const dequeue = (queue: Tile[]): Tile => {
        queue.sort((a, b) => _distances[a.row][a.col] - _distances[b.row][b.col])
        return queue.shift()!
    }

    const menuItems = (): JSX.Element[] => {
        const items: JSX.Element[] = []
        for (const _algo of Object.values(Algo)) {
            items.push(<MenuItem key={Math.random()} className='flex items-center' onClick={() => {
                setAlgo(_algo)
            }}>
                <>{_algo == algo ? <BiCheck className='text-xl' /> : null}</>
                <>{_algo}</></MenuItem>)
        }
        return items
    }


    return <Box className='flex flex-col justify-center'>
        <Box className='flex gap-6 items-center justify-start mx-20 mb-5'>
            <Toolbar />
            <Box className='flex ml-auto'>
                <Menu>
                    <MenuButton as={Button} rightIcon={<BiChevronDown />}>
                        Algorithm
                    </MenuButton>
                    <MenuList>
                        {menuItems()}
                    </MenuList>
                </Menu>
                <Button onClick={() => setIsVisualizing(true)}>visualize</Button>
                <Button onClick={() => setResetBoard(true)} isDisabled={!isVisualizing}>reset</Button>
            </Box>
        </Box>
        <Grid templateColumns='repeat(58, 1fr)' className='mx-auto'>
            {_matrix.map((tileRow) => tileRow.map((tile) => <GridTile key={Math.random()}
                isShiftKeyPressed={isShiftKeyPressed}
                tile={tile} />))}
        </Grid>
    </Box>

}