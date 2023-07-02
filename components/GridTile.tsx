import { Box, Popover, PopoverBody, PopoverContent, PopoverTrigger, useColorMode } from '@chakra-ui/react'
import { GiBrickWall } from 'react-icons/gi'
import { useEffect, useState } from 'react'
import { Tile, TileState } from '../dijkstra/Tile'
import { getIconFromState } from '../constants/icons'

interface GridTileProps {
    matrix: Tile[][]
    distances: number[][]
    parents: Tile[]
    tile: Tile
}

export const GridTile: React.FC<GridTileProps> = ({ matrix, distances, parents, tile }) => {
    const [state, setState] = useState<TileState>(tile.tileState)
    const [isWall, setIsWall] = useState<boolean>(tile.isWall)

    // const setWall = (row: number, col: number): void => {
    //     console.log(row, col)
    //     const tile = this.matrix[row][col]
    //     this.matrix[row][col] = new Tile(TileState.WALL, tile.row, tile.col, WALL_COST)
    //   }

    const className =
        state === TileState.DEST
            ? 'node-finish'
            : state === TileState.SRC
                ? 'node-start'
                : isWall ? 'node-wall' : ''


    return (<Box onClick={() => null}>
        <Box
            minW={7}
            minH={7}>
            <Box id={`node-${tile.row}-${tile.col}`}
                className={`flex justify-center items-center cursor-pointer node ${className}`}>
                {getIconFromState(tile.tileState)}</Box>
        </Box>
    </Box>)
}