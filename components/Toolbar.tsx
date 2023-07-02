import { Box, Button, Heading, Menu, MenuButton, MenuItem, MenuItemOption, MenuList } from '@chakra-ui/react'
import { TileState } from '../dijkstra/Tile'
import { Dispatch, SetStateAction } from 'react'
import { destinationVertexIcon, sourceVertexIcon } from '../constants/icons'
import { FaPlus } from 'react-icons/fa'
import { BiChevronDown } from 'react-icons/bi'

interface ToolbarProps {
    editingState: TileState
    setEditingState: Dispatch<SetStateAction<TileState>>
}

export const Toolbar: React.FC<ToolbarProps> = ({ editingState, setEditingState }) => {
    return <Box className='flex justify-start flex-col mx-20'>
        <Box className='flex items-center my-10'>
            <Heading as='h1'>Pathfinding Visualizer</Heading>
        </Box>
        <Box className='flex gap-10'>
            <LegendButton editingState={editingState} setEditingState={setEditingState} text={'Source'} state={TileState.SRC} icon={sourceVertexIcon} />
            <LegendButton editingState={editingState} setEditingState={setEditingState} text={'Destination'} state={TileState.DEST} icon={destinationVertexIcon} />
            <LegendButton editingState={editingState} setEditingState={setEditingState} text={'Wall'} state={TileState.UNVISITED} />
            <LegendButton editingState={editingState} setEditingState={setEditingState} text={'Shortest Path'} state={TileState.PATH} />
            <Box className='flex ml-auto gap-6'>
                <Menu>
                    <MenuButton as={Button} rightIcon={<BiChevronDown />}>
                        Algorithm
                    </MenuButton>
                    <MenuList>
                        <MenuItem>Dijkstra&apos;s (Selected)</MenuItem>
                        <MenuItem isDisabled>A* Search (WIP)</MenuItem>
                        <MenuItem isDisabled>Iterative Deepening Search (WIP)</MenuItem>
                        <MenuItem isDisabled>Generic BFS (WIP)</MenuItem>
                        <MenuItem isDisabled>Generic DFS (WIP)</MenuItem>
                    </MenuList>
                </Menu>
                <Button>
                    Erase Board
                </Button>
                <Button variant={'outline'}>
                    Erase Board
                </Button>
            </Box>
        </Box>

    </Box>
}

interface LegendButtonProps extends ToolbarProps {
    icon?: JSX.Element
    text: string
    state: TileState
}

const LegendButton: React.FC<LegendButtonProps> = ({ icon, text, state, editingState, setEditingState }) => {
    return <Box className='flex items-center gap-3' onClick={() => setEditingState(state)}>
        {icon}
        {text}
    </Box>
}