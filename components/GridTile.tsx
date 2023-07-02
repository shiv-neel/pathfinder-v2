import { Box, Popover, PopoverBody, PopoverContent, PopoverTrigger, useColorMode } from '@chakra-ui/react'
import { Tile, TileState } from '../dijkstra/Tile'
import { GiBrickWall } from 'react-icons/gi'
import { getIconFromState, getTileColorFromstate } from '../constants/icons'
import { useEffect, useState } from 'react'
import { Node } from '../dijkstra/Pathfinder'

interface GridTileProps {
    matrix: Tile[][]
    distances: number[][]
    parents: Node[]
    tile: Tile
}

export const GridTile: React.FC<GridTileProps> = ({ matrix, distances, parents, tile }) => {
    const [state, setState] = useState<TileState>(tile.tileState)
    const [isWall, setIsWall] = useState<boolean>(tile.tileState === TileState.WALL)

    // const setWall = (row: number, col: number): void => {
    //     console.log(row, col)
    //     const tile = this.matrix[row][col]
    //     this.matrix[row][col] = new Tile(TileState.WALL, tile.row, tile.col, WALL_COST)
    //   }

    if (!distances[tile.row]) return <></>

    const className =
        state === TileState.DEST
            ? 'node-finish'
            : state === TileState.SRC
                ? 'node-start'
                : state === TileState.WALL
                    ? 'node-wall'
                    : ''


    return (<Box onClick={() => null}>
        <Box
            border={'0.1px solid gray'}
            minW={7}
            minH={7}>
            <Box id={`node-${tile.row}-${tile.col}`} className={`flex justify-center items-center cursor-pointer node ${className}`}>{getIconFromState(tile.getTileState())}</Box>
        </Box>
    </Box>)
}