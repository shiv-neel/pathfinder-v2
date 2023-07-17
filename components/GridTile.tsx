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
    trafficJams: Tile[]
    setTrafficJams: Dispatch<SetStateAction<Tile[]>>
    isAddingTrafficJam: boolean
    matrix: Tile[][]
    setIsEditingSrc: Dispatch<SetStateAction<boolean>>
    setIsEditingDest: Dispatch<SetStateAction<boolean>>
    setIsAddingTrafficJam: Dispatch<SetStateAction<boolean>>
    edgeCost: number
    isShiftKeyPressed: boolean
}

export const GridTile: React.FC<GridTileProps> = ({
    tile, src, setSrc, isEditingSrc,
    dest, setDest, isEditingDest, trafficJams, setTrafficJams, isAddingTrafficJam,
    matrix, setIsEditingSrc, setIsEditingDest, setIsAddingTrafficJam, edgeCost, isShiftKeyPressed
}) => {
    const [isWall, setIsWall] = useState<boolean>(false)
    const className = tile.isWall ? 'node-wall' : ''

    const handleToggleWallState = () => {
        if (tile.tileState === TileState.SRC || tile.tileState === TileState.DEST ||
            tile.tileState === TileState.TRAFFIC) return
        if (!isShiftKeyPressed) return
        tile.isWall = !tile.isWall
        tile.dist = tile.isWall ? WALL_COST : 0
        console.log(tile.isWall)
        setIsWall(tile.isWall)
    }

    const handleClick = () => {
        if (isShiftKeyPressed || tile.isWall) {
            handleToggleWallState()
            return
        }
        if (tile.tileState === TileState.SRC) {
            setIsEditingSrc(!isEditingSrc)
            setIsEditingDest(false)
            setIsAddingTrafficJam(false)
        }
        else if (tile.tileState === TileState.DEST) {
            setIsEditingDest(!isEditingDest)
            setIsEditingSrc(false)
            setIsAddingTrafficJam(false)
        }
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
        else if (isAddingTrafficJam) {
            if (tile.tileState === TileState.SRC || tile.tileState === TileState.DEST) return
            if (tile.tileState === TileState.TRAFFIC) {
                tile.setTileState(TileState.UNVISITED)
                setTrafficJams(trafficJams.filter(cone => cone !== tile))
            }
            else {
                tile.setTileState(TileState.TRAFFIC)
                tile.dist = edgeCost
                setTrafficJams([...trafficJams, tile])
            }
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