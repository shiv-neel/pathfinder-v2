import React, { use, useContext, useEffect, useState } from 'react'
import { Box, Button, Grid, Menu, MenuButton, MenuItem, MenuList, Tooltip, useDisclosure } from '@chakra-ui/react'
import { Tile, TileState } from '../pathfinder/Tile'
import { GridTile } from './GridTile'
import { COLS, INITIAL_MATRIX_STATE, ROWS, WALL_COST, dequeue, getNeighbors, isVisited, speedNormalizer } from '../pathfinder/main'
import { BiCheck, BiChevronDown, BiChevronRight, BiEraser, BiHelpCircle } from 'react-icons/bi'
import { Algo, AnimationSpeed } from '../models/types'
import { FaBomb, FaCogs } from 'react-icons/fa'
import { PiPathBold } from 'react-icons/pi'
import { MdOutlineReplay } from 'react-icons/md'
import SettingsModal from './SettingsModal'
import { GiBrickWall } from 'react-icons/gi'

interface WorldProps {
    isMousePressed: boolean
    setIsMousePressed: React.Dispatch<React.SetStateAction<boolean>>
    onOpenTutorial: () => void
}



export const World: React.FC<WorldProps> = ({ isMousePressed, setIsMousePressed, onOpenTutorial }) => {
    var _distances: number[][] = Array(ROWS).fill(null).map(() => Array(COLS).fill(1000))
    var _parents: Tile[] = []
    var _matrix = INITIAL_MATRIX_STATE
    var _visitedSet: Tile[] = []


    const [src, setSrc] = useState<Tile>(new Tile(TileState.SRC, 12, 11))
    const [dest, setDest] = useState<Tile>(new Tile(TileState.DEST, 12, 33))
    const [bombs, setBombs] = useState<Tile[]>([])
    const [algo, setAlgo] = useState<Algo>(Algo.DIJKSTRA)
    const [reset, setReset] = useState<boolean>(false)

    const [isEditingSrc, setIsEditingSrc] = useState<boolean>(false)
    const [isEditingDest, setIsEditingDest] = useState<boolean>(false)
    const [isAddingBomb, setIsAddingBomb] = useState<boolean>(false)
    const [isAddingWalls, setIsAddingWalls] = useState<boolean>(true)
    const [isErasing, setIsErasing] = useState<boolean>(false)

    const [edgeWeight, setEdgeWeight] = useState<number>(20)
    const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeed>(AnimationSpeed.MEDIUM)
    const { isOpen, onOpen, onClose } = useDisclosure()

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

                    if (v.row === destRow && v.col === destCol) {
                        _getShortestPathSequence()
                        return
                    }
                    if (_matrix[v.row][v.col].isWall) {
                        _matrix[v.row][v.col].setTileState(TileState.VISITED)
                        continue
                    }
                    queue.push(v)
                    if (!isVisited(_visitedSet, v))
                        _visitedSet.push(v)
                }
            }
        }
        alert('No path found!')
    }

    const _bfs = (): void => {
        const srcRow = src.row
        const srcCol = src.col
        const destRow = dest.row
        const destCol = dest.col

        const queue: Tile[] = [new Tile(TileState.UNVISITED, srcRow, srcCol)]
        while (queue.length > 0) {
            const u = dequeue(queue, _distances)
            if (u.isWall) continue
            const neighbors = getNeighbors(u.row, u.col, _matrix)
            for (let i = 0; i < neighbors.length; i++) {
                const v = neighbors[i]
                if (isVisited(_visitedSet, v) || _matrix[v.row][v.col].isWall) continue
                _parents[v.row * COLS + v.col] = u

                if (v.row === destRow && v.col === destCol) {
                    _getShortestPathSequence()
                    return
                }
                queue.push(v)
                if (!isVisited(_visitedSet, v))
                    _visitedSet.push(v)

            }
        }
        alert('No path found!')
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
                }, speedNormalizer[animationSpeed] * i)
                setTimeout(() => {
                }, speedNormalizer[animationSpeed] * i)
                return
            }
            setTimeout(() => {
                const node = _visitedSet[i]
                if (!_matrix[node.row][node.col].isWall)


                    document.getElementById(`node-${node.row}-${node.col}`)!.className =

                        'node node-visited'
            }, speedNormalizer[animationSpeed] * i)
        }
    }

    const _animateShortestPath = (sequence: Tile[]) => {
        for (let i = 0; i < sequence.length; i++) {
            setTimeout(() => {
                const node = sequence[i]
                document.getElementById(`node-${node.row}-${node.col}`)!.className =
                    'node node-shortest-path'
            }, (speedNormalizer[animationSpeed]) * i)
        }
    }

    const _setWall = (row: number, col: number) => {
        if (row === src.row && col === src.col || row === dest.row && col === dest.col) return
        _matrix[row][col].setIsWall(true)
        _matrix[row][col].setDist(WALL_COST)
    }

    const menuItems = (): JSX.Element[] => {
        const items: JSX.Element[] = []
        for (const _algo of Object.values(Algo)) {
            items.push(<MenuItem isDisabled={_algo === Algo.A_STAR} key={Math.random()} className='flex items-center hover:font-bold' onClick={() => {
                setAlgo(_algo)
            }}>
                <>{_algo == algo ? <BiCheck className='text-xl text-green-600' /> : null}</>
                <>{_algo}</></MenuItem>)
        }
        return items
    }

    const handleBombAddClick = () => {
        if (!isAddingBomb) {
            setIsEditingSrc(false)
            setIsEditingDest(false)
            setIsAddingWalls(false)
            setIsErasing(false)
        }
        setIsAddingBomb(s => !s)

    }

    const handleWallsAddClick = () => {
        if (!isAddingWalls) {
            setIsEditingSrc(false)
            setIsEditingDest(false)
            setIsAddingBomb(false)
            setIsErasing(false)
        }
        setIsAddingWalls(s => !s)

    }

    const handleEraserClick = () => {
        if (!isErasing) {
            setIsEditingSrc(false)
            setIsEditingDest(false)
            setIsAddingBomb(false)
            setIsAddingWalls(false)
        }
        setIsErasing(s => !s)
    }

    const getHelperText = () => {
        if (isEditingSrc || isEditingDest) {
            return <Box className='flex gap-3 items-center mx-auto animate-bounce font-bold text-blue-400'>
                Drag and drop {isEditingSrc ? 'source' : 'destination'}.
            </Box>
        }
        else if (isAddingWalls) {
            return <Box className='flex gap-3 items-center mx-auto animate-bounce font-bold text-purple-400'>
                Click and drag on cells to add WALLS.
            </Box>
        }
        else if (isAddingBomb) {
            return <Box className='flex gap-3 items-center mx-auto animate-bounce font-bold text-orange-400'>
                Click and drag on cells to add BOMBS.
            </Box>
        }
        else if (isErasing) {
            return <Box className='flex gap-3 items-center mx-auto animate-bounce font-bold text-red-400'>
                Click and drag on cells to ERASE bombs and walls.
            </Box>
        }
        else {
            return <Box className='flex gap-3 items-center mx-auto animate-pulse font-bold text-green-400'>
                Finish customizing your grid, and then hit visualize!
            </Box>
        }
    }


    return <Box className='flex flex-col justify-center'>
        <Box className='flex gap-6 items-center mx-10 mb-5'>
            <Box className='flex gap-6 items-center'>
                <Menu>
                    <MenuButton as={Button} rightIcon={<BiChevronDown />} variant='outline' className=''>
                        {algo}
                    </MenuButton>
                    <MenuList bg='black'>
                        {menuItems()}
                    </MenuList>
                </Menu>
                <Button onClick={_pathVisualizer} variant='outline' className='flex gap-2 bg-gray-200 text-black hover:text-white'>
                    <PiPathBold className='text-lg text-purple-600' />Visualize!
                </Button>
                <Button onClick={() => setReset(true)} variant='outline' className='flex gap-2 bg-gray-200 text-black hover:text-white'><MdOutlineReplay className='text-lg text-red-400' />Reset</Button>
            </Box>

            <Box className='ml-auto flex gap-6'>
                {getHelperText()}
                <Tooltip label='Walls are IMPENETRABLE. The algorithm will try to find a path around these walls.' aria-label='Add Walls'>
                    <Button onClick={handleWallsAddClick}
                        className={`flex gap-3 items-center`}
                        colorScheme={isAddingWalls ? 'purple' : 'gray'}
                        variant='outline'><GiBrickWall className='text-lg' /> Walls
                    </Button>
                </Tooltip>
                <Tooltip label='Bombs are WEIGHTED EDGES.
                Weighted algorithms like Dijkstra&apos;s and A* will try to avoid these cells if it can.' aria-label='Add Bombs'>
                    <Button onClick={handleBombAddClick}
                        className={`flex gap-3 items-center`}
                        colorScheme={isAddingBomb ? 'orange' : 'gray'}
                        variant='outline'><FaBomb className='text-lg' /> Bombs
                    </Button>
                </Tooltip>
                <Tooltip label='Click and drag to RESET cells.' aria-label='Add Walls'>
                    <Button onClick={handleEraserClick}
                        className={`flex gap-3 items-center`}
                        colorScheme={isErasing ? 'pink' : 'gray'}
                        variant='outline'><BiEraser className='text-lg' /> Eraser
                    </Button>
                </Tooltip>
                <Tooltip label='Settings' aria-label='Settings'>
                    <Button onClick={onOpen} variant='outline' className='flex gap-2'> <FaCogs className='text-lg text-green-600' /></Button>
                </Tooltip>
            </Box>
            <SettingsModal isOpen={isOpen} onOpen={onOpen} onClose={onClose}
                animationSpeed={animationSpeed} setAnimationSpeed={setAnimationSpeed}
                edgeWeight={edgeWeight} setEdgeWeight={setEdgeWeight} />
        </Box>
        <Grid templateColumns={`repeat(${COLS}, 1fr)`} className='mx-auto'>
            {_matrix.map((tileRow) => tileRow.map((tile) => <GridTile key={Math.random()}
                src={src}
                setSrc={setSrc}
                isEditingSrc={isEditingSrc}
                dest={dest}
                setDest={setDest}
                isEditingDest={isEditingDest}
                bombs={bombs}
                setBombs={setBombs}
                isAddingBomb={isAddingBomb}
                isAddingWalls={isAddingWalls}
                matrix={_matrix}
                isMousePressed={isMousePressed}
                setIsMousePressed={setIsMousePressed}
                setIsEditingSrc={setIsEditingSrc}
                setIsEditingDest={setIsEditingDest}
                setIsAddingBomb={setIsAddingBomb}
                setIsAddingWall={setIsAddingWalls}
                edgeCost={edgeWeight}
                isErasing={isErasing}
                setIsErasing={setIsErasing}
                tile={tile} />))}
        </Grid>
    </Box>
}