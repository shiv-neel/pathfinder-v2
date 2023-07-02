import { Box, Button, Heading, Menu, MenuButton, MenuItem, MenuItemOption, MenuList } from '@chakra-ui/react'
import { TileState } from '../dijkstra/Tile'
import { Dispatch, SetStateAction, useContext } from 'react'
import { destinationVertexIcon, shortestPathIcon, sourceVertexIcon, wallIcon } from '../constants/icons'
import { FaPlus } from 'react-icons/fa'
import { BiCheck, BiChevronDown } from 'react-icons/bi'
import { AppContext } from './AppContext'

interface ToolbarProps { }

export const Toolbar: React.FC<ToolbarProps> = ({ }) => {
    const appContext = useContext(AppContext)
    const { algo, setAlgo, setResetBoard, isVisualizing, setIsVisualizing } = appContext

    return <Box className='flex justify-start flex-col'>
        <Box className='flex gap-10'>
            <LegendButton text={'Source'} state={TileState.SRC} icon={sourceVertexIcon} />
            <LegendButton text={'Destination'} state={TileState.DEST} icon={destinationVertexIcon} />
            <LegendButton text={'Wall'} state={TileState.UNVISITED} icon={wallIcon} />
            <LegendButton text={'Shortest Path'} state={TileState.PATH} icon={shortestPathIcon} />
        </Box>

    </Box>
}

interface LegendButtonProps extends ToolbarProps {
    icon?: JSX.Element
    text: string
    state: TileState
}

const LegendButton: React.FC<LegendButtonProps> = ({ icon, text, state }) => {
    return <Box className='flex items-center gap-2'>
        {icon}
        {text}
    </Box>
}