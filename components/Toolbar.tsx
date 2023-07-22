import { Box, Button, Heading, Menu, MenuButton, MenuItem, MenuItemOption, MenuList } from '@chakra-ui/react'
import { TileState } from '../pathfinder/Tile'
import { Dispatch, SetStateAction, useContext } from 'react'
import { destinationVertexIcon, shortestPathIcon, sourceVertexIcon, bombIcon, visitedNodeIcon, wallIcon } from '../constants/icons'
import { FaPlus } from 'react-icons/fa'
import { PiGraphFill } from 'react-icons/pi'
import { BiSolidHelpCircle } from 'react-icons/bi'

interface ToolbarProps {
    onOpen: () => void
}

export const Toolbar: React.FC<ToolbarProps> = ({ onOpen }) => {

    return <Box className='flex items-center mx-10 py-5 mb-5 mt-5'>
        <Box className='flex items-center gap-3'>
            <PiGraphFill className='text-5xl text-purple-600' />
            <Heading as='h1'>Pathfinding Visualizer</Heading>
            <BiSolidHelpCircle className='text-4xl text-white cursor-pointer hover:scale-150 duration-100' onClick={onOpen} />
        </Box>
        <Box className='flex justify-start flex-col ml-auto'>
            <Box className='flex gap-5'>
                <LegendButton text={'Source'} state={TileState.SRC} icon={sourceVertexIcon} />
                <LegendButton text={'Destination'} state={TileState.DEST} icon={destinationVertexIcon} />
                <LegendButton text={'Bomb'} state={TileState.BOMB} icon={bombIcon} />
                <LegendButton text={'Wall'} state={TileState.UNVISITED} icon={wallIcon} />
                <LegendButton text={'Visited'} state={TileState.VISITED} icon={visitedNodeIcon} />
                <LegendButton text={'Path'} state={TileState.PATH} icon={shortestPathIcon} />
            </Box>
        </Box>
    </Box>
}

interface LegendButtonProps {
    icon?: JSX.Element
    text: string
    state: TileState
}

const LegendButton: React.FC<LegendButtonProps> = ({ icon, text, state }) => {
    return <Box className='flex items-center gap-2 bottom-0 text-sm'>
        {icon}
        {text}
    </Box>
}