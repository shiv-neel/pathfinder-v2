import { Box, Button, Heading, Menu, MenuButton, MenuItem, MenuItemOption, MenuList } from '@chakra-ui/react'
import { TileState } from '../dijkstra/Tile'
import { Dispatch, SetStateAction, useContext } from 'react'
import { destinationVertexIcon, shortestPathIcon, sourceVertexIcon, wallIcon } from '../constants/icons'
import { FaPlus } from 'react-icons/fa'
import { BiCheck, BiChevronDown } from 'react-icons/bi'
import { AppContext } from './AppContext'
import { Algo } from '../models/types'

interface ToolbarProps { }

export const Toolbar: React.FC<ToolbarProps> = ({ }) => {
    const appContext = useContext(AppContext)
    const { algo, setAlgo, setResetBoard, isVisualizing, setIsVisualizing } = appContext


    const menuItems = (): JSX.Element[] => {
        const items: JSX.Element[] = []
        for (const _algo of Object.values(Algo)) {
            items.push(<MenuItem key={algo} className='flex items-center' onClick={() => {
                setAlgo(_algo)
            }}>
                {_algo == algo ? <BiCheck className='text-xl' /> : null}
                {_algo}</MenuItem>)
        }
        return items
    }

    return <Box className='flex justify-start flex-col mx-20'>
        <Box className='flex items-center my-10'>
            <Heading as='h1'>Pathfinding Visualizer</Heading>
        </Box>
        <Box className='flex gap-10'>
            <LegendButton text={'Source'} state={TileState.SRC} icon={sourceVertexIcon} />
            <LegendButton text={'Destination'} state={TileState.DEST} icon={destinationVertexIcon} />
            <LegendButton text={'Wall'} state={TileState.UNVISITED} icon={wallIcon} />
            <LegendButton text={'Shortest Path'} state={TileState.PATH} icon={shortestPathIcon} />
            <Box className='flex ml-auto gap-6'>
                <Menu>
                    <MenuButton as={Button} rightIcon={<BiChevronDown />}>
                        Algorithm
                    </MenuButton>
                    <MenuList>
                        {menuItems()}
                    </MenuList>
                </Menu>
                <Button onClick={() => setIsVisualizing(true)} isDisabled={isVisualizing}>visualize</Button>
                <Button onClick={() => setResetBoard(true)} isDisabled={!isVisualizing}>reset</Button>
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
    return <Box className='flex items-center gap-2'>
        {icon}
        {text}
    </Box>
}