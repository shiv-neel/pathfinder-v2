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
    matrix: Tile[][]
    setIsEditingSrc: Dispatch<SetStateAction<boolean>>
    setIsEditingDest: Dispatch<SetStateAction<boolean>>
    setIsAddingBomb: Dispatch<SetStateAction<boolean>>
    edgeCost: number
    isMousePressed: boolean
}

export const GridTile: React.FC<GridTileProps> = ({
    tile, src, setSrc, isEditingSrc,
    dest, setDest, isEditingDest, bombs, setBombs, isAddingBomb,
    matrix, setIsEditingSrc, setIsEditingDest, setIsAddingBomb, edgeCost, isMousePressed
}) => {
    const [isWall, setIsWall] = useState<boolean>(false)

    const handleToggleWallState = () => {
        if (tile.tileState === TileState.SRC || tile.tileState === TileState.DEST ||
            tile.tileState === TileState.BOMB) return
        if (!isMousePressed) return
        tile.isWall = !tile.isWall
        tile.dist = tile.isWall ? WALL_COST : 0
        console.log(tile.isWall)
        setIsWall(tile.isWall)
    }

    const handleClick = () => {
        if (isMousePressed || tile.isWall) {
            handleToggleWallState()
            return
        }
        if (tile.tileState === TileState.SRC) {
            setIsEditingSrc(!isEditingSrc)
            setIsEditingDest(false)
            setIsAddingBomb(false)
        }
        else if (tile.tileState === TileState.DEST) {
            setIsEditingDest(!isEditingDest)
            setIsEditingSrc(false)
            setIsAddingBomb(false)
        }
        if (isEditingSrc) {
            if (tile.tileState === TileState.SRC || tile.tileState === TileState.DEST) return
            matrix[src.row][src.col].setTileState(TileState.UNVISITED)
            tile.setTileState(TileState.SRC)
            tile.setIsWall(false)
            setSrc(tile)
            setIsEditingSrc(false)
        }
        else if (isEditingDest) {
            if (tile.tileState === TileState.SRC || tile.tileState === TileState.DEST) return
            matrix[dest.row][dest.col].setTileState(TileState.UNVISITED)
            tile.setTileState(TileState.DEST)
            tile.setIsWall(false)
            setDest(tile)
            setIsEditingDest(false)
        }
        else if (isAddingBomb) {
            if (tile.tileState === TileState.SRC || tile.tileState === TileState.DEST) return
            if (tile.tileState === TileState.BOMB) {
                tile.setTileState(TileState.UNVISITED)
                setBombs(bombs.filter(b => b !== tile))
            }
            else {
                tile.setTileState(TileState.BOMB)
                tile.dist = edgeCost
                setBombs([...bombs, tile])
                tile.setIsWall(false)
            }
        }
    }

    return (
        <Box
            // onMouseUp={}
            onMouseEnter={handleToggleWallState}
            onClick={handleClick}
            width={7}
            height={7}>
            <Box id={`node-${tile.row}-${tile.col}`}
                className={`flex justify-center items-center cursor-pointer node`}>
                {getIconFromState(tile.tileState)}</Box>
        </Box>
    )
}