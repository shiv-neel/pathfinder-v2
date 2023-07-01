import { Box, useColorMode } from '@chakra-ui/react'
import { Tile, TileState } from '../dijkstra/Tile'
import { GiBrickWall } from 'react-icons/gi'
import { getIconFromState } from '../constants/icons'
import { useEffect, useState } from 'react'
import { Node, Pathfinder } from '../dijkstra/Pathfinder'

interface GridTileProps {
    pathfinder: Pathfinder
    distances: number[][]
    parents: Node[][]
    tile: Tile
}

export const GridTile: React.FC<GridTileProps> = ({ pathfinder, distances, parents, tile }) => {
    const [state, setState] = useState<TileState>(tile.tileState)
    const optimisticUpdateTileState = () => {
        pathfinder.setWall(tile.row!, tile.col!)
        setState(tile.tileState === TileState.EMPTY ? TileState.WALL : TileState.EMPTY)
    }

    if (!distances[tile.row]) return <></>

    var textColor

    if (tile.getTileState() === TileState.WALL) textColor = 'red.500'
    else if (tile.getTileState() === TileState.SRC || tile.getTileState() === TileState.DEST) textColor = 'blue.500'

    // if (pathfinder.getSequence().filter(u => u.row === tile.row && u.col === tile.col)) textColor = 'green.500'

    return (<Box onClick={optimisticUpdateTileState}>
        <Box color={textColor} className='flex justify-center items-center cursor-pointer' border='0.1px solid' borderColor={'gray.600'} minW={7} minH={7}>

            {distances[tile.row][tile.col]}
        </Box></Box>)
}