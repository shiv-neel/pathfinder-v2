import React, { use, useContext, useEffect, useState } from 'react'
import { Box, Button, Grid, Menu, MenuButton, MenuItem, MenuList, Tooltip } from '@chakra-ui/react'
import { Tile, TileState } from '../pathfinder/Tile'
import { GridTile } from './GridTile'
import { BOMB_COST, COLS, INITIAL_MATRIX_STATE, ROWS, WALL_COST, dequeue, findKeyWithSmallestValue, getNeighbors, heuristic, isVisited } from '../pathfinder/main'
import { motion } from 'framer-motion'
import { BiCheck, BiChevronDown } from 'react-icons/bi'
import { Algo } from '../models/types'
import { Toolbar } from './Toolbar'
import { FiMapPin, FiMove } from 'react-icons/fi'
import { sourceVertexIcon } from '../constants/icons'
import { BsCarFrontFill } from 'react-icons/bs'
import { FaMapMarkerAlt } from 'react-icons/fa'

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
    const [reset, setReset] = useState<boolean>(false)

    const [isEditingSrc, setIsEditingSrc] = useState<boolean>(false)
    const [isEditingDest, setIsEditingDest] = useState<boolean>(false)

    _matrix[src.row][src.col].setTileState(TileState.SRC)
    _matrix[dest.row][dest.col].setTileState(TileState.DEST)

    useEffect(() => {
        if (!reset) return
        _resetAllWalls()
        _resetMatrix()
        _resetDistanceMatrix()
        _resetParentMatrix()
        _resetVisitedSet()
        setReset(false)
    }, [reset])

    const _resetAllWalls = (): void => {
        for (let row = 0; row < ROWS; row++) {

            for (let col = 0; col < COLS; col++) {
                _matrix[row][col].isWall = false
                _matrix[row][col].dist = 0
                _matrix[row][col].setTileState(TileState.UNVISITED)
            }
        }
    }

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

    const _resetVisitedSet = () => {
        _visitedSet = new Array<Tile>()
    }

    const _pathVisualizer = () => {
        _resetDistanceMatrix()
        _resetParentMatrix()
        _resetVisitedSet()

        switch (algo) {
            case Algo.DIJKSTRA:
                _dijkstra()
                break
            case Algo.A_STAR:
                _aStar()
                break
            case Algo.GENERIC_BFS:
                _bfs()
                break
            case Algo.GENERIC_DFS:
                _dfs()
                break
        }
    }

    const _dijkstra = (): void => {
        const srcRow = src.row
        const srcCol = src.col
        const destRow = dest.row
        const destCol = dest.col

        const queue: Tile[] = [new Tile(TileState.UNVISITED, srcRow, srcCol)]
        _distances[srcRow][srcCol] = 0
        while (queue.length > 0) {
            const u = dequeue(queue, _distances)
            if (u.isWall) continue
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
                        _getShortestPathSequence()
                        return
                    }
                    queue.push(v)
                    if (!isVisited(_visitedSet, v))
                        _visitedSet.push(v)
                }
            }
        }
        _getShortestPathSequence()
    }

    const _aStar = (): void => {
        const srcRow = src.row
        const srcCol = src.col
        const destRow = dest.row
        const destCol = dest.col

        const openSet = new Set<Tile>() // set of discovered nodes that may need to be (re-)expanded
        openSet.add(_matrix[srcRow][srcCol])

        const gOn = new Map<Tile, number>() // map of distances from start along optimal path
        gOn.set(_matrix[srcRow][srcCol], 0) // distance from start to start is 0

        const fOn = new Map<Tile, number>() // map of heuristic function values for each node
        fOn.set(_matrix[srcRow][srcCol], heuristic(_matrix[srcRow][srcCol], _matrix[destRow][destCol]))

        while (openSet.size > 0) {
            const current = findKeyWithSmallestValue(fOn)
            if (current == dest)
                console.log(reconstructPath(_parents, current))

            openSet.delete(current)
            const neighbors = getNeighbors(current.row, current.col, _matrix)
            for (let i = 0; i < neighbors.length; i++) {
                const v = neighbors[i]
                const gScoreTentative = (gOn.get(current) ?? Infinity) + v.dist!
                if (gScoreTentative < (gOn.get(v) ?? Infinity)) {
                    _parents[v.row * COLS + v.col] = current
                    gOn.set(v, gScoreTentative)
                    fOn.set(v, gScoreTentative + heuristic(v, _matrix[destRow][destCol]))
                    if (!isVisited(_visitedSet, v))
                        _visitedSet.push(v)
                    if (_matrix[v.row][v.col].isWall)
                        _matrix[v.row][v.col].setTileState(TileState.VISITED)
                    if (!openSet.has(v))
                        openSet.add(v)
                }
            }
        }
    }

    const reconstructPath = (parents: Tile[], current: Tile): Tile[] => {
        const totalPath = [current]
        while (parents[current.row * COLS + current.col] != null) {
            current = parents[current.row * COLS + current.col]
            totalPath.unshift(current)
        }
        return totalPath
    }

    const _bfs = (): void => {
        const srcRow = src.row
        const srcCol = src.col
        const destRow = dest.row
        const destCol = dest.col

        const queue: Tile[] = [_matrix[srcRow][srcCol]]

        while (queue.length > 0) {
            const u = queue.shift()!
            if (u.isWall) continue
            const neighbors = getNeighbors(u.row, u.col, _matrix)
            for (let i = 0; i < neighbors.length; i++) {
                const v = neighbors[i]
                if (v.isWall) continue
                if (!isVisited(_visitedSet, v)) {
                    _visitedSet.push(v)
                    _parents[v.row * COLS + v.col] = u
                    if (v.row === destRow && v.col === destCol) {
                        _getShortestPathSequence()
                        return
                    }
                    queue.push(v)
                }
            }
        }
        _getShortestPathSequence()
    }


    const _dfs = (): void => {
        const srcRow = src.row
        const srcCol = src.col
        const destRow = dest.row
        const destCol = dest.col

        _dfsRecursive(_matrix[srcRow][srcCol], _matrix[destRow][destCol])
        _getShortestPathSequence()
    }

    const _dfsRecursive = (u: Tile, dest: Tile) => {
        if (u.row === dest.row && u.col === dest.col) {
            console.log('found')
            console.log(_visitedSet)
        }

        if (u.isWall) return

        _visitedSet.push(u)

        const neighbors = getNeighbors(u.row, u.col, _matrix)
        for (let i = 0; i < neighbors.length; i++) {
            const v = neighbors[i]
            if (!_matrix[v.row][v.col].isWall && !isVisited(_visitedSet, v)) {
                _parents[v.row * COLS + v.col] = u
                _dfsRecursive(v, dest)
            }
        }
        _matrix[u.row][u.col].setTileState(TileState.VISITED)
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
        _animateVisits(sequence)
    }


    const _animateVisits = (sequence: Tile[]) => {
        for (let i = 0; i <= _visitedSet.length; i++) {
            if (i === _visitedSet.length || _visitedSet[i].row === dest.row && _visitedSet[i].col === dest.col) {
                setTimeout(() => {
                    _animateShortestPath(sequence)
                }, 10 * i)
                setTimeout(() => {
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

    const _temporaryWeightedEdges = () => {
        _setWall(10, 10)
        _setWall(10, 11)
        _setWall(10, 12)
        _setWall(10, 13)
        _setWall(11, 13)
        _setWall(12, 13)
        _setWall(13, 13)
        _setWall(14, 13)
        _setWall(15, 13)
        _setWall(15, 12)
    }

    const _setWall = (row: number, col: number) => {
        if (row === src.row && col === src.col || row === dest.row && col === dest.col) return
        _matrix[row][col].setIsWall(true)
        _matrix[row][col].setDist(WALL_COST)
    }

    const menuItems = (): JSX.Element[] => {
        const items: JSX.Element[] = []
        for (const _algo of Object.values(Algo)) {
            items.push(<MenuItem key={Math.random()} className='flex items-center hover:font-bold' onClick={() => {
                setAlgo(_algo)
            }}>
                <>{_algo == algo ? <BiCheck className='text-xl' /> : null}</>
                <>{_algo}</></MenuItem>)
        }
        return items
    }

    const handleSrcEditClick = () => {
        if (!isEditingSrc) {
            setIsEditingSrc(true)
            setIsEditingDest(false)
        }
        else {
            setIsEditingSrc(false)
        }
    }

    const handleDestEditClick = () => {
        if (!isEditingDest) {
            setIsEditingDest(true)
            setIsEditingSrc(false)
        }
        else {
            setIsEditingDest(false)
        }
    }

    // _temporaryWeightedEdges()
    return <Box className='flex flex-col justify-center'>
        <Box className='flex gap-6 items-center justify-start mx-20 mb-5'>
            <Box className='flex gap-6'>
                <Menu>
                    <MenuButton as={Button} rightIcon={<BiChevronDown />} variant='outline'>
                        Selected: {algo}
                    </MenuButton>
                    <MenuList bg='black'>
                        {menuItems()}
                    </MenuList>
                </Menu>
                <Menu>
                    <MenuButton as={Button} rightIcon={<BiChevronDown />} variant='outline'>
                        Wall Patterns
                    </MenuButton>
                    <MenuList bg='black'>
                        {menuItems()}
                    </MenuList>
                </Menu>
                <Button onClick={_pathVisualizer} variant='outline' className='bg-purple-600'>Visualize Algorithm</Button>
                <Button onClick={() => setReset(true)} variant='solid'>Reset Board</Button>

            </Box>
            <Box className='flex ml-auto gap-6 items-center'>
                <Tooltip label='Move Source' aria-label='Move Source Node'>
                    <Button onClick={handleSrcEditClick}
                        className={`flex gap-3 ${isEditingSrc ? 'bg-blue-600' : ''}`}
                        variant='outline'>
                        <FiMove /><BsCarFrontFill />
                    </Button>
                </Tooltip>
                <Tooltip label='Move Destination' aria-label='Move Destination'>
                    <Button onClick={handleDestEditClick} className={`flex gap-3 ${isEditingDest ? 'bg-red-600' : ''}`} variant='outline'><FiMove /><FaMapMarkerAlt /></Button>
                </Tooltip>
            </Box>
        </Box>
        <Grid templateColumns={`repeat(${COLS}, 1fr)`} className='mx-auto'>
            {_matrix.map((tileRow) => tileRow.map((tile) => <GridTile key={Math.random()}
                src={src}
                setSrc={setSrc}
                isEditingSrc={isEditingSrc}
                setIsEditingSrc={setIsEditingSrc}
                dest={dest}
                setDest={setDest}
                isEditingDest={isEditingDest}
                setIsEditingDest={setIsEditingDest}
                matrix={_matrix}
                isShiftKeyPressed={isShiftKeyPressed}
                tile={tile} />))}
        </Grid>
    </Box>
}