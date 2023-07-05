import { Box, Popover, PopoverBody, PopoverContent, PopoverTrigger, useColorMode } from '@chakra-ui/react'
import { GiBrickWall } from 'react-icons/gi'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Tile, TileState } from '../pathfinder/Tile'
import { getIconFromState } from '../constants/icons'
import { WALL_COST } from '../pathfinder/main'

interface GridTileProps {
    tile: Tile
    src: Tile
    setSrc: Dispatch<SetStateAction<Tile>>
    isEditingSrc: boolean
    setIsEditingSrc: Dispatch<SetStateAction<boolean>>
    dest: Tile
    setDest: Dispatch<SetStateAction<Tile>>
    isEditingDest: boolean
    setIsEditingDest: Dispatch<SetStateAction<boolean>>
    matrix: Tile[][]
    isShiftKeyPressed: boolean
}

export const GridTile: React.FC<GridTileProps> = ({
    tile, src, setSrc, isEditingSrc, setIsEditingSrc,
    dest, setDest, isEditingDest, setIsEditingDest,
    matrix, isShiftKeyPressed
}) => {
    const [isWall, setIsWall] = useState<boolean>(false)
    const [isSourceNode, setIsSourceNode] = useState<boolean>(tile.tileState === TileState.SRC)
    const className =
        tile.tileState === TileState.DEST
            ? 'node-finish'
            : tile.tileState === TileState.SRC
                ? 'node-start'
                : tile.isWall ? 'node-wall' : ''

    const handleToggleWallState = () => {
        if (tile.tileState === TileState.SRC || tile.tileState === TileState.DEST) return
        if (!isShiftKeyPressed) return
        tile.isWall = !tile.isWall
        tile.dist = tile.isWall ? WALL_COST : 0
        console.log(tile.isWall)
        setIsWall(tile.isWall)
    }

    const handleClick = () => {
        if (isEditingSrc) {
            if (tile.tileState === TileState.SRC || tile.tileState === TileState.DEST) return
            matrix[src.row][src.col].setTileState(TileState.UNVISITED)
            tile.setTileState(TileState.SRC)
            setSrc(tile)
            setIsEditingSrc(false)
        }
        else if (isEditingDest) {
            if (tile.tileState === TileState.SRC || tile.tileState === TileState.DEST) return
            matrix[dest.row][dest.col].setTileState(TileState.UNVISITED)
            tile.setTileState(TileState.DEST)
            setDest(tile)
            setIsEditingDest(false)
        }
        else { // toggling wall
            handleToggleWallState()
        }
    }

    return (
        <Box
            onMouseEnter={handleToggleWallState}
            onClick={handleClick}
            minW={7}
            minH={7}>
            <Box id={`node-${tile.row}-${tile.col}`}
                className={`flex justify-center items-center cursor-pointer node ${className}`}>
                {getIconFromState(tile.tileState)}</Box>
        </Box>
    )
}