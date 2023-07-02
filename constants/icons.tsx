import { VscTarget } from 'react-icons/vsc'
import { FaChevronRight } from 'react-icons/fa'
import { TileState } from '../dijkstra/Tile'

export const sourceVertexIcon = <FaChevronRight className='text-blue-500 text-2xl' />

export const destinationVertexIcon = <VscTarget className='text-red-500 text-2xl' />

export const getIconFromState = (state: TileState) => {
    switch (state) {
        case TileState.SRC:
            return sourceVertexIcon
        case TileState.DEST:
            return destinationVertexIcon
        default:
            return <></>
    }
}

export const getTileColorFromstate = (state: TileState) => {
    switch (state) {
        case TileState.WALL:
            return 'blue.900'
        case TileState.PATH:
            return 'green.700'
        case TileState.VISITED:
            return 'blue.800'
        default:
            return 'none'
    }
}