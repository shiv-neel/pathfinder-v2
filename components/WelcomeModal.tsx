import { Box, Button, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tooltip, useDisclosure } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { World } from './World'
import { FiMove } from 'react-icons/fi'
import { BsCarFrontFill, BsShiftFill } from 'react-icons/bs'
import { FaMapMarkerAlt, FaMousePointer } from 'react-icons/fa'
import { Algo } from '../models/types'
import { BiCheck, BiChevronDown, BiPlus, BiPointer } from 'react-icons/bi'

const WelcomeModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [page, setPage] = useState<number>(0)

    const headers = ['Pathfinding Visualizer', 'Source and Destination Nodes', 'Draw Walls', 'Select Algorithm and Wall Patterns']
    const pages = [<WelcomeContent />, <SetSrcDestLocationContent />, <DrawWallsContent />, <AlgorithmWallsSelectorContent />]

    useEffect(() => {
        onOpen()
    }, [])
    return (
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size={'xl'}>

            <ModalOverlay />
            <ModalContent>
                <Box bg='messenger.800' rounded='xl'>
                    <ModalHeader>{headers[page]}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {pages[page]}
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='outline' mr={3} onClick={() => setPage(p => p - 1)} isDisabled={page === 0}>
                            Prev
                        </Button>
                        <Button variant='outline' mr={3}
                            onClick={page < pages.length - 1 ? (() => setPage(p => p + 1)) : onClose}>
                            {page < pages.length - 1 ? 'Next' : 'Close'}</Button>
                        {`(${page + 1}/${pages.length})`}
                    </ModalFooter>
                </Box>
            </ModalContent>
        </Modal>)
}

const WelcomeContent = () => {
    return <Box>
        <Box className='text-sm leading-relaxed'>
            Welcome to Pathfinding Visualizer! This application simulates shortest path discovery for different graph algorithms,
            such as BFS, DFS, Dijkstra&apos;s, A*, and more.
        </Box>
        <Box className='flex justify-center items-center mt-10'>
            TODO insert a gif of pathfinding
        </Box>
    </Box>
}

const SetSrcDestLocationContent = () => {
    return <Box>
        <Box className='text-sm leading-relaxed'>
            To specify the location of the source and destination nodes, click
            the respective <strong>Move Source</strong> and <strong>Move Destination </strong> buttons
            on the right-hand side of the toolbar, and then select the desired cell on the map.
            <br></br><br></br>

        </Box>
        <Box className='flex justify-center items-center'>
            <Box className='flex gap-6 items-center'>
                <Tooltip label='Move Source' aria-label='Move Source Node'>
                    <Button
                        className={`flex gap-3 bg-black`}
                        variant='outline'>
                        <FiMove /><BsCarFrontFill />
                    </Button>
                </Tooltip>
                <Tooltip label='Move Destination' aria-label='Move Destination'>
                    <Button className={`flex gap-3 bg-black`} variant='outline'><FiMove /><FaMapMarkerAlt /></Button>
                </Tooltip>
            </Box>
        </Box>
    </Box>
}

const DrawWallsContent = () => {

    const shiftKey = <Box className='flex justify-center items-center gap-3 rounded-md hover:cursor-pointer text-lg
    p-3 text-black bg-white w-32 shadow-md my-5'><BsShiftFill /> Shift</Box>
    const iconGroup = <Box className='flex justify-center items-center mx-auto gap-1 text-lg'>{shiftKey}<BiPlus /> <FaMousePointer className='text-2xl' /></Box>
    return <Box>
        <Box className='text-sm'>To draw walls, hold down the shift key, and hover over the cells you wish to toggle walls.
            {iconGroup}
        </Box>
        <Box className='flex justify-center items-center mt-10'>
            TODO insert gif of drawing walls here
        </Box>
    </Box>
}

const AlgorithmWallsSelectorContent = () => {
    const [algo, setAlgo] = useState<Algo>(Algo.DIJKSTRA)

    const algoMenuItems = (): JSX.Element[] => {
        const items: JSX.Element[] = []
        for (const _algo of Object.values(Algo)) {
            items.push(<MenuItem key={Math.random()} className='flex items-center hover:font-bold'><>{_algo == algo ? <BiCheck className='text-xl' /> : null}</>
                <>{_algo}</></MenuItem>)
        }
        return items
    }

    return <Box>
        <Box className='text-sm leading-relaxed'>
            Select the algorithm to visualize using the selector in the top left menu of the toolbar.
        </Box>
        <Box className='flex justify-center items-center mt-2'>
            <Menu>
                <MenuButton as={Button} rightIcon={<BiChevronDown />} className='bg-gray-200 text-black hover:text-white' variant='outline'>
                    Selected: {algo}
                </MenuButton>
                <MenuList bg={'black'}>
                    {algoMenuItems()}
                </MenuList>
            </Menu>
        </Box>
        <Box className='text-sm leading-relaxed mt-5'>
            If desired, select a wall configuration preset.
        </Box>
        <Box className='flex justify-center items-center mt-2'>
            <Menu>
                <MenuButton as={Button} rightIcon={<BiChevronDown />} className='bg-gray-200 text-black hover:text-white' variant='outline'>
                    Selected: {algo}
                </MenuButton>
                <MenuList bg={'black'}>
                    {algoMenuItems()}
                </MenuList>
            </Menu>
        </Box>
    </Box>
}

export default WelcomeModal