import { Box, Button, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tooltip, useDisclosure } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { World } from './World'
import { FiMove } from 'react-icons/fi'
import { BsCarFrontFill, BsShiftFill } from 'react-icons/bs'
import { FaBomb, FaCogs, FaMapMarkerAlt, FaMousePointer } from 'react-icons/fa'
import { Algo } from '../models/types'
import { BiCheck, BiChevronDown, BiPlus } from 'react-icons/bi'
import { LiaHandPointerSolid } from 'react-icons/lia'

import '../public/maze_demo.gif'
import '../public/add_walls.gif'

import { AiOutlinePlus } from 'react-icons/ai'
import { PiPathBold } from 'react-icons/pi'
import { MdOutlineReplay } from 'react-icons/md'
import Image from 'next/image'
import { destinationVertexIcon, sourceVertexIcon } from '../constants/icons'

interface WelcomeModalProps {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onOpen, onClose }) => {
    const [page, setPage] = useState<number>(0)

    const headers = ['Pathfinding Visualizer', 'Draw Walls', 'Edit Vertex Locations', 'Add Weighted Edges', 'Select Algorithm and Settings', 'Simulation Controls']
    const pages = [<WelcomeContent key={1} />, <DrawWallsContent key={2} />, <SetSrcDestLocationContent key={3} />, <WeightedEdges key={4} />, <AlgorithmWallsSelectorContent key={5} />, <SimulationControls key={6} />]

    useEffect(() => {
        onOpen()
    }, [])
    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'xl'} closeOnOverlayClick={false}>

            <ModalOverlay />
            <ModalContent>
                <Box bg='messenger.800' rounded='xl'>
                    <ModalHeader>{headers[page]}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {pages[page]}
                    </ModalBody>
                    <ModalFooter >
                        <Button variant='outline' mr={'auto'} onClick={onClose} colorScheme='black'>
                            Skip Tutorial
                        </Button>
                        <Button variant='outline' mr={3} onClick={() => setPage(p => p - 1)} isDisabled={page === 0} colorScheme='black'>
                            Prev
                        </Button>
                        <Button variant='outline' mr={3}
                            onClick={page < pages.length - 1 ? (() => setPage(p => p + 1)) : onClose} colorScheme='black'>
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
            such as BFS, DFS, and Dijkstra&apos;s.
        </Box>
        <Box className='flex justify-center items-center mt-10'>

            <Image src='/maze_demo.gif' alt='' width={400} height={300} />
        </Box>
    </Box>
}

const DrawWallsContent = () => {
    return <Box>
        <Box className='text-lg flex gap-1'>Click the <strong>Draw Walls</strong> button, then click and drag on the grid.
        </Box>
        <Box className='flex justify-center items-center mt-10'>
            <Image src='/add_walls.gif' alt='' width={400} height={300} />
        </Box>
    </Box>
}

const SetSrcDestLocationContent = () => {
    return <Box>
        <Box className='text-lg mb-5'>
            Drag and drop the source and destination vertices to the desired locations.
        </Box>
        <Box>

        </Box>
        <Box className='flex justify-center items-center gap-6'>
            {sourceVertexIcon}
            {destinationVertexIcon}
        </Box>
    </Box>
}

const WeightedEdges = () => {

    return <Box>
        <Box className='text-lg leading-relaxed'>
            After clicking the <strong>Draw Bombs</strong> button, you can add weighted edges, and edit the weight in the <strong>Settings</strong> menu.
        </Box>
        <Box className='flex justify-center items-center mt-10'>

            <Image src='/traffic_jams.gif' alt='' width={400} height={300} />
        </Box>
    </Box>
}

const AlgorithmWallsSelectorContent = () => {
    const [algo, setAlgo] = useState<Algo>(Algo.DIJKSTRA)

    const algoMenuItems = (): JSX.Element[] => {
        const items: JSX.Element[] = []
        for (const _algo of Object.values(Algo)) {
            items.push(<MenuItem onClick={() => setAlgo(_algo)} key={Math.random()} className='flex items-center hover:font-bold'><>{_algo == algo ? <BiCheck className='text-xl text-green-600' /> : null}</>
                <>{_algo}</></MenuItem>)
        }
        return items
    }

    return <Box>
        <Box className='text-lg leading-relaxed'>
            Select the algorithm to visualize using the dropdown menu in the toolbar.
        </Box>
        <Box className='flex justify-center items-center mt-5'>
            <Menu>
                <MenuButton as={Button} rightIcon={<BiChevronDown />} className='bg-black hover:text-white' variant='outline'>
                    {algo}
                </MenuButton>
                <MenuList bg={'black'}>
                    {algoMenuItems()}
                </MenuList>
            </Menu>
        </Box>
        <Box className='text-lg leading-relaxed mt-5'>
            For all other settings, click the <strong>Settings</strong> button.
        </Box>
        <Box className='flex justify-center items-center mt-5'>
            <Button onClick={() => { }} variant='outline' className='flex gap-2'>
                <FaCogs className='text-lg text-green-600' /> </Button>
        </Box>
    </Box>
}


const SimulationControls = () => {
    return <Box>
        <Box className='text-lg leading-relaxed'>
            Use these controls to start and reset the simulation.
        </Box>
        <Box className='flex gap-6 justify-center items-center mt-5'>
            <Button variant='outline' className='flex gap-2'><PiPathBold className='text-lg text-purple-600' />Visualize</Button>
            <Button variant='outline' className='flex gap-2'><MdOutlineReplay className='text lg text-red-400' /> Reset</Button>
        </Box>
        <Box className='text-sm mt-5 italic'>
            Disclaimer: the simulation logic uses CSS keyframes, which do not pair nicely with react state hooks.
            Thus, resetting <strong>during</strong> the simulation may cause unexpected animation behavior.
        </Box>
    </Box>
}

export default WelcomeModal