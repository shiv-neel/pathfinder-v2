import { BsCarFrontFill } from 'react-icons/bs'
import { FiMapPin } from 'react-icons/fi'
import { Tile, TileState } from '../dijkstra/Tile'

export const sourceVertexIcon = <BsCarFrontFill />

export const destinationVertexIcon = <FiMapPin />

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