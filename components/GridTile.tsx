import { Box, Popover, PopoverBody, PopoverContent, PopoverTrigger, useColorMode } from '@chakra-ui/react'
import { GiBrickWall } from 'react-icons/gi'
import { useEffect, useState } from 'react'
import { Tile, TileState } from '../dijkstra/Tile'
import { getIconFromState } from '../constants/icons'

interface GridTileProps {
    tile: Tile
    isShiftKeyPressed: boolean
}

export const GridTile: React.FC<GridTileProps> = ({ tile, isShiftKeyPressed }) => {
    const className =
        tile.tileState === TileState.DEST
            ? 'node-finish'
            : tile.tileState === TileState.SRC
                ? 'node-start'
                : tile.isWall ? 'node-wall' : ''

    const handleToggleWallState = () => {
        if (!isShiftKeyPressed) return
        console.log('handle toggle')
        tile.toggleWallState()
    }

    useEffect(() => {

    }, [tile.tileState])

    return (
        <Box
            onMouseEnter={handleToggleWallState}
            minW={7}
            minH={7}>
            <Box id={`node-${tile.row}-${tile.col}`}
                className={`flex justify-center items-center cursor-pointer node ${className}`}>
                {getIconFromState(tile.tileState)}</Box>
        </Box>
    )
}