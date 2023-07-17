import React, { use, useContext, useEffect, useState } from 'react'
import { Box, Button, Grid, Menu, MenuButton, MenuItem, MenuList, Tooltip, useDisclosure } from '@chakra-ui/react'
import { Tile, TileState } from '../pathfinder/Tile'
import { GridTile } from './GridTile'
import { COLS, INITIAL_MATRIX_STATE, ROWS, WALL_COST, dequeue, getNeighbors, isVisited, speedNormalizer } from '../pathfinder/main'
import { BiCheck, BiChevronDown } from 'react-icons/bi'
import { Algo, AnimationSpeed } from '../models/types'
import { FiMove } from 'react-icons/fi'
import { BsCarFrontFill } from 'react-icons/bs'
import { FaGrinTears, FaMapMarkerAlt, FaTrafficLight, FaCogs, FaBomb } from 'react-icons/fa'
import { AiOutlinePlus } from 'react-icons/ai'
import { PiPathBold } from 'react-icons/pi'
import { MdOutlineReplay } from 'react-icons/md'
import SettingsModal from './SettingsModal'

interface WorldProps {
    isShiftKeyPressed: boolean
}



export const World: React.FC<WorldProps> = ({ isShiftKeyPressed }) => {
    var _distances: number[][] = Array(ROWS).fill(null).map(() => Array(COLS).fill(1000))
    var _parents: Tile[] = []
    var _matrix = INITIAL_MATRIX_STATE
    var _visitedSet: Tile[] = []


    const [src, setSrc] = useState<Tile>(new Tile(TileState.SRC, 12, 10))
    const [dest, setDest] = useState<Tile>(new Tile(TileState.DEST, 12, 40))
    const [trafficJams, setTrafficJams] = useState<Tile[]>([])
    const [algo, setAlgo] = useState<Algo>(Algo.DIJKSTRA)
    const [reset, setReset] = useState<boolean>(false)

    const [isEditingSrc, setIsEditingSrc] = useState<boolean>(false)
    const [isEditingDest, setIsEditingDest] = useState<boolean>(false)
    const [isAddingTrafficJam, setIsAddingTrafficJam] = useState<boolean>(false)

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
            items.push(<MenuItem key={Math.random()} className='flex items-center hover:font-bold' onClick={() => {
                setAlgo(_algo)
            }}>
                <>{_algo == algo ? <BiCheck className='text-xl text-green-600' /> : null}</>
                <>{_algo}</></MenuItem>)
        }
        return items
    }

    const description = (): JSX.Element => {
        let description
        let editing
        if (algo === Algo.DIJKSTRA) {
            description = <p>
                <span className='font-bold text-green-500'>Dijkstra&apos;s</span> Algorithm is weighted, and guaranteed to find the shortest path.
                It will avoid <span className='font-bold text-orange-600'>traffic jams</span> when possible.</p>
        }
        else if (algo === Algo.GENERIC_BFS) {
            description = <p><span className='font-bold text-green-500'>Breadth-First Search (BFS)</span> is unweighted, and not guaranteed to find the shortest path.</p>
        }
        else if (algo === Algo.GENERIC_DFS) {
            description = <p><span className='font-bold text-green-500'>Depth-First Search (DFS)</span> unweighted, and not guaranteed to find the shortest path.</p>
        }

        if (isShiftKeyPressed) {
            editing = <p>Hover over tile to create or delete <span className='font-bold text-gray-200'>walls</span></p>
        }
        else if (isEditingSrc) {
            editing = <p>Click on a tile to edit the <span className='font-bold text-blue-400'>source</span></p>
        }
        else if (isEditingDest) {
            editing = <p>Click on a tile to edit the <span className='font-bold text-red-500'>destination</span></p>
        }
        else if (isAddingTrafficJam) {
            editing = <p>Click on a tile to add or remove a <span className='font-bold text-orange-600'>traffic jam</span></p>
        }
        else {
            editing = null
        }
        return <Box className='flex justify-between w-full'><Box className='mr-auto'>{description}</Box><Box className='ml-auto'>{editing}</Box></Box>
    }

    const handleSrcEditClick = () => {
        if (!isEditingSrc) {
            setIsEditingSrc(true)
            setIsEditingDest(false)
            setIsAddingTrafficJam(false)
        }
        else {
            setIsEditingSrc(false)
        }
    }

    const handleDestEditClick = () => {
        if (!isEditingDest) {
            setIsEditingDest(true)
            setIsEditingSrc(false)
            setIsAddingTrafficJam(false)
        }
        else {
            setIsEditingDest(false)
        }
    }

    const handleTrafficEditClick = () => {
        if (!isAddingTrafficJam) {
            setIsAddingTrafficJam(s => !s)
            setIsEditingSrc(false)
            setIsEditingDest(false)
        }
        else {
            setIsAddingTrafficJam(false)
        }
    }

    return <Box className='flex flex-col justify-center'>
        <Box className='flex gap-6 items-center justify-start mx-40 mb-5'>
            <Box className='flex gap-6'>
                <Menu>
                    <MenuButton as={Button} rightIcon={<BiChevronDown />} variant='outline' className='bg-gray-200 text-black hover:text-white'>
                        Selected: {algo}
                    </MenuButton>
                    <MenuList bg='black'>
                        {menuItems()}
                    </MenuList>
                </Menu>

                <Button onClick={onOpen} variant='outline' className='flex gap-2'> <FaCogs className='text-lg text-green-600' /> Configure Simulation</Button>
                <Button onClick={_pathVisualizer} variant='outline' className='flex gap-2'>
                    <PiPathBold className='text-lg text-purple-600' />Visualize Algorithm!
                </Button>
                <SettingsModal isOpen={isOpen} onOpen={onOpen} onClose={onClose}
                    animationSpeed={animationSpeed} setAnimationSpeed={setAnimationSpeed}
                    edgeWeight={edgeWeight} setEdgeWeight={setEdgeWeight} />
                <Button onClick={() => setReset(true)} variant='outline' className='flex gap-2'><MdOutlineReplay className='text lg text-red-400' /> Reset Board</Button>

            </Box>
            <Box className='flex ml-auto gap-6 items-center'>
                <Tooltip label='Add Traffic Jam' aria-label='Add Traffic Jam'>
                    <Button onClick={handleTrafficEditClick}
                        className={`flex gap-3 ${isAddingTrafficJam ? 'bg-orange-600' : ''}`}
                        variant='outline'>
                        <AiOutlinePlus /><FaBomb />
                    </Button>
                </Tooltip>
                <Tooltip label='Move Source' aria-label='Move Source Vertex'>
                    <Button onClick={handleSrcEditClick}
                        className={`flex gap-3 ${isEditingSrc ? 'bg-blue-600' : ''}`}
                        variant='outline'>
                        <FiMove /><BsCarFrontFill />
                    </Button>
                </Tooltip>
                <Tooltip label='Move Destination' aria-label='Move Destination Vertex'>
                    <Button onClick={handleDestEditClick} className={`flex gap-3 ${isEditingDest ? 'bg-red-600' : ''}`} variant='outline'><FiMove /><FaMapMarkerAlt /></Button>
                </Tooltip>
            </Box>
        </Box>
        <Box className='flex mx-20 mb-2'>
            {description()}
        </Box>
        <Grid templateColumns={`repeat(${COLS}, 1fr)`} className='mx-auto'>
            {_matrix.map((tileRow) => tileRow.map((tile) => <GridTile key={Math.random()}
                src={src}
                setSrc={setSrc}
                isEditingSrc={isEditingSrc}
                dest={dest}
                setDest={setDest}
                isEditingDest={isEditingDest}
                trafficJams={trafficJams}
                setTrafficJams={setTrafficJams}
                isAddingTrafficJam={isAddingTrafficJam}
                matrix={_matrix}
                isShiftKeyPressed={isShiftKeyPressed}
                setIsEditingSrc={setIsEditingSrc}
                setIsEditingDest={setIsEditingDest}
                setIsAddingTrafficJam={setIsAddingTrafficJam}
                edgeCost={edgeWeight}
                tile={tile} />))}
        </Grid>
    </Box>
}