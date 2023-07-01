import { BiSolidCar } from 'react-icons/bi'
import { FaSquare } from 'react-icons/fa'
import { FiTarget } from 'react-icons/fi'
import { GiBrickWall } from 'react-icons/gi'
import { TileState } from '../dijkstra/Tile'

export const sourceVertexIcon = <BiSolidCar className='text-blue-500 text-2xl' />

export const destinationVertexIcon = <FiTarget className='text-blue-500 text-2xl' />

export const wallIcon = <GiBrickWall className='text-amber-900 text-2xl' />

export const visitedIcon = <FaSquare className='text-yellow-500 text-2xl' />

export const shortestPathIcon = <FaSquare className='text-blue-500 text-2xl' />

export const getIconFromState = (state: TileState) => {
    switch (state) {
        case TileState.SRC:
            return sourceVertexIcon
        case TileState.DEST:
            return destinationVertexIcon
        case TileState.WALL:
            return wallIcon
        case TileState.VISITED:
            return visitedIcon
        case TileState.PATH:
            return shortestPathIcon
    }
}