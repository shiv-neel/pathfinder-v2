import { BsCarFrontFill } from 'react-icons/bs'
import { Tile, TileState } from '../pathfinder/Tile'
import { Box } from '@chakra-ui/react'
import { FaBomb, FaMapMarkerAlt, FaTrafficLight } from 'react-icons/fa'

export const sourceVertexIcon = <Box w={7} h={7} backgroundColor='#006AFF'
    borderRadius={'15%'} className='flex items-center justify-center cursor-pointer hover:scale-105 duration-100'>
    <BsCarFrontFill className='text-lg' />
</Box>

export const destinationVertexIcon = <Box w={7} h={7} backgroundColor='#E50914'
    borderRadius={'15%'} className='flex items-center justify-center cursor-pointer  hover:scale-105 duration-100'>
    <FaMapMarkerAlt className='text-lg' />
</Box>

export const bombIcon = <Box w={7} h={7} backgroundColor='#EA580C'
    borderRadius={'15%'} className='flex items-center justify-center cursor-pointer hover:scale-105 duration-100'>
    <FaBomb />
</Box>

export const wallIcon = <Box w={7} h={7} backgroundColor='#FFFFFF' borderRadius={'15%'}></Box>

export const visitedNodeIcon = <Box w={7} h={7} backgroundColor='#450175' border='1px solid gray' borderRadius={'15%'}></Box>

export const shortestPathIcon = <Box w={7} h={7} backgroundColor='#1DB954' borderRadius={'15%'}></Box>

export const getIconFromState = (state: TileState) => {
    switch (state) {
        case TileState.SRC:
            return sourceVertexIcon
        case TileState.DEST:
            return destinationVertexIcon
        case TileState.BOMB:
            return bombIcon
        default:
            return <></>
    }
}