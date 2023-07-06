import { Box, Button, Heading, Menu, MenuButton, MenuItem, MenuItemOption, MenuList } from '@chakra-ui/react'
import { TileState } from '../pathfinder/Tile'
import { Dispatch, SetStateAction, useContext } from 'react'
import { destinationVertexIcon, shortestPathIcon, sourceVertexIcon, visitedNodeIcon, wallIcon } from '../constants/icons'
import { FaPlus } from 'react-icons/fa'
import { PiGraphFill } from 'react-icons/pi'

interface ToolbarProps { }

export const Toolbar: React.FC<ToolbarProps> = ({ }) => {

    return <Box className='flex items-center px-20 py-5 mb-10 mt-5'>
        <Box className='flex items-center gap-3'>
            <PiGraphFill className='text-5xl text-purple-600' />
            <Heading as='h1'>Pathfinding Visualizer</Heading>
        </Box>
        <Box className='flex justify-start flex-col ml-auto'>
            <Box className='flex gap-10'>
                <LegendButton text={'Source Node'} state={TileState.SRC} icon={sourceVertexIcon} />
                <LegendButton text={'Destination Node'} state={TileState.DEST} icon={destinationVertexIcon} />
                <LegendButton text={'Wall Node'} state={TileState.UNVISITED} icon={wallIcon} />
                <LegendButton text={'Visited Node'} state={TileState.VISITED} icon={visitedNodeIcon} />
                <LegendButton text={'Calculated Shortest Path'} state={TileState.PATH} icon={shortestPathIcon} />
            </Box>
        </Box>
    </Box>
}

interface LegendButtonProps extends ToolbarProps {
    icon?: JSX.Element
    text: string
    state: TileState
}

const LegendButton: React.FC<LegendButtonProps> = ({ icon, text, state }) => {
    return <Box className='flex items-center gap-2 bottom-0'>
        {icon}
        {text}
    </Box>
}