import { Box, Popover, PopoverBody, PopoverContent, PopoverTrigger, useColorMode } from '@chakra-ui/react'
import { GiBrickWall } from 'react-icons/gi'
import { useEffect, useState } from 'react'
import { Tile, TileState } from '../dijkstra/Tile'
import { getIconFromState } from '../constants/icons'

interface GridTileProps {
    tile: Tile
}

export const GridTile: React.FC<GridTileProps> = ({ tile }) => {


    const className =
        tile.tileState === TileState.DEST
            ? 'node-finish'
            : tile.tileState === TileState.SRC
                ? 'node-start'
                : tile.isWall ? 'node-wall' : ''


    return (<Box>
        <Box
            minW={7}
            minH={7}>
            <Box id={`node-${tile.row}-${tile.col}`}
                className={`flex justify-center items-center cursor-pointer node ${className}`}>
                {getIconFromState(tile.tileState)}</Box>
        </Box>
    </Box>)
}