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
    dest: Tile
    setDest: Dispatch<SetStateAction<Tile>>
    isEditingDest: boolean
    bombs: Tile[]
    setBombs: Dispatch<SetStateAction<Tile[]>>
    isAddingBomb: boolean
    isAddingWalls: boolean
    matrix: Tile[][]
    setIsEditingSrc: Dispatch<SetStateAction<boolean>>
    setIsEditingDest: Dispatch<SetStateAction<boolean>>
    setIsAddingBomb: Dispatch<SetStateAction<boolean>>
    edgeCost: number
    isMousePressed: boolean
    setIsMousePressed: Dispatch<SetStateAction<boolean>>
}

export const GridTile: React.FC<GridTileProps> = ({
    tile, src, setSrc, isEditingSrc,
    dest, setDest, isEditingDest, bombs, setBombs, isAddingBomb, isAddingWalls,
    matrix, setIsEditingSrc, setIsEditingDest, setIsAddingBomb, edgeCost, isMousePressed, setIsMousePressed
}) => {
    const [isWall, setIsWall] = useState<boolean>(false)
    const [isBomb, setIsBomb] = useState<boolean>(false)

    const handleMouseDown = () => {
        setIsMousePressed(true)
        if (isAddingWalls) {
            if (tile.tileState === TileState.SRC || tile.tileState === TileState.DEST) return
            tile.setIsWall(true)
            setIsWall(true)
        }
        else if (isAddingBomb) {
            if (tile.tileState === TileState.SRC || tile.tileState === TileState.DEST) return
            tile.setTileState(TileState.BOMB)
            tile.dist = edgeCost
            setBombs([...bombs, tile])
            tile.setIsWall(false)
        }
        else {
            setIsWall(false)
            tile.setTileState(TileState.UNVISITED)
        }
    }

    const handleMouseEnter = () => {
        if (!isMousePressed) return
        if (isAddingWalls) {
            if (tile.tileState === TileState.SRC || tile.tileState === TileState.DEST) return
            tile.setIsWall(true)
            setIsWall(true)
        }
        else if (isAddingBomb) {
            if (tile.tileState === TileState.SRC || tile.tileState === TileState.DEST) return
            tile.setTileState(TileState.BOMB)
            tile.dist = edgeCost
            setBombs([...bombs, tile])
            tile.setIsWall(false)
        }
        setIsWall(true)
    }

    const handleMouseUp = () => {
        setIsMousePressed(false)
    }

    return (
        <Box
            // onMouseUp={}
            onMouseEnter={handleMouseEnter}
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            // onClick={handleClick}
            width={7}
            height={7}>
            <Box id={`node-${tile.row}-${tile.col}`}
                className={`flex justify-center items-center cursor-pointer node ${tile.isWall ? ' node-wall' : ''}`}>
                {getIconFromState(tile.tileState)}</Box>
        </Box>
    )
}