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
    isErasing: boolean
    matrix: Tile[][]
    setIsEditingSrc: Dispatch<SetStateAction<boolean>>
    setIsEditingDest: Dispatch<SetStateAction<boolean>>
    setIsAddingBomb: Dispatch<SetStateAction<boolean>>
    setIsAddingWall: Dispatch<SetStateAction<boolean>>
    setIsErasing: Dispatch<SetStateAction<boolean>>
    edgeCost: number
    isMousePressed: boolean
    setIsMousePressed: Dispatch<SetStateAction<boolean>>
}

export const GridTile: React.FC<GridTileProps> = ({
    tile, src, setSrc, isEditingSrc,
    dest, setDest, isEditingDest, bombs, setBombs, isAddingBomb, isAddingWalls,
    matrix, setIsEditingSrc, setIsEditingDest, setIsAddingBomb, setIsAddingWall, edgeCost, isMousePressed, setIsMousePressed, isErasing, setIsErasing
}) => {
    const [isWall, setIsWall] = useState<boolean>(false)
    const [isBomb, setIsBomb] = useState<boolean>(false)

    const handleMouseDown = () => {
        setIsMousePressed(true)
        if (tile.tileState === TileState.SRC) {
            if (isEditingSrc) {
                setIsEditingSrc(false)
                return
            }
            setIsEditingSrc(true)
            setIsEditingDest(false)
            setIsAddingBomb(false)
            setIsAddingWall(false)
            setIsErasing(false)
        }
        if (tile.tileState === TileState.DEST) {
            if (isEditingDest) {
                setIsEditingDest(false)
                return
            }
            setIsEditingDest(true)
            setIsEditingSrc(false)
            setIsAddingBomb(false)
            setIsAddingWall(false)
            setIsErasing(false)
        }
        if (isErasing) {
            if (tile.tileState === TileState.SRC || tile.tileState === TileState.DEST) return
            tile.setIsWall(false)
            tile.setTileState(TileState.UNVISITED)
            return
        }
        if (isAddingWalls) {
            if (tile.tileState === TileState.SRC || tile.tileState === TileState.DEST) return
            tile.setIsWall(true)
            setIsWall(true)
        }
        if (isAddingBomb) {
            if (tile.tileState === TileState.SRC || tile.tileState === TileState.DEST) return
            tile.setTileState(TileState.BOMB)
            tile.dist = edgeCost
            setBombs([...bombs, tile])
            tile.setIsWall(false)
        }
        if (isEditingSrc) {
            if (tile.tileState === TileState.DEST) return
            matrix[src.row][src.col].setTileState(TileState.UNVISITED)
            tile.setTileState(TileState.SRC)
            setSrc(tile)
            setIsEditingSrc(false)
        }
        if (isEditingDest) {
            if (tile.tileState === TileState.SRC) return
            matrix[dest.row][dest.col].setTileState(TileState.UNVISITED)
            tile.setTileState(TileState.DEST)
            setDest(tile)
            setIsEditingDest(false)
        }
    }

    const handleMouseEnter = () => {
        if (!isMousePressed) return
        if (isErasing) {
            if (tile.tileState === TileState.SRC || tile.tileState === TileState.DEST) return
            tile.setIsWall(false)
            tile.setTileState(TileState.UNVISITED)
            return
        }
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
            onMouseEnter={handleMouseEnter}
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            width={7}
            height={7}>
            <Box id={`node-${tile.row}-${tile.col}`}
                className={`flex justify-center items-center cursor-pointer node ${tile.isWall ? ' node-wall' : ''} 
                ${tile.tileState === TileState.SRC && isEditingSrc || tile.tileState === TileState.DEST && isEditingDest ? 'animate-bounce' : ''}`}>
                {getIconFromState(tile.tileState, isEditingSrc, isEditingDest)}</Box>
        </Box>
    )
}