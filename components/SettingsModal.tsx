import { Box, Button, Divider, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, ModalProps, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, useDisclosure } from '@chakra-ui/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi'
import { GiRabbit, GiTortoise } from 'react-icons/gi'
import { RiSpeedUpFill } from 'react-icons/ri'
import { AnimationSpeed } from '../models/types'
import { IoInfiniteOutline } from 'react-icons/io5'

interface SettingsModalProps {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
    animationSpeed: number
    setAnimationSpeed: Dispatch<SetStateAction<number>>
    edgeWeight: number
    setEdgeWeight: Dispatch<SetStateAction<number>>
}
const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onOpen, onClose, animationSpeed, setAnimationSpeed, edgeWeight, setEdgeWeight }) => {

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
                <ModalOverlay />
                <ModalContent>
                    <Box bg='messenger.800' rounded='xl'>
                        <ModalHeader>Configure Simulation</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <Box>
                                <Box className='text-lg font-semibold mb-2'>Cell Weights for Dijkstra&apos;s</Box>
                                <Box className='text-sm mb-5 flex flex-col gap-2'>
                                    <Box className='flex gap-2 items-center'>Wall: <IoInfiniteOutline className='text-xl' /></Box>
                                    <Box>Empty: 5</Box>
                                    <Box className='flex gap-5'>Bomb: {edgeWeight} <p className='underline cursor-pointer text-purple-400' onClick={() => setEdgeWeight(20)}>Reset to Default</p></Box>
                                </Box>
                                <Box>
                                    <Box className='text-lg font-semibold mb-2 mt-5'>Bomb Weight [ +5, +50 ] </Box>
                                    <Box className='text-sm flex gap-5 items-center'>
                                        5
                                        <Slider value={edgeWeight} defaultValue={edgeWeight} min={5} max={50} onChange={(val) => setEdgeWeight(val)} step={1}>
                                            <SliderTrack>
                                                <SliderFilledTrack />
                                            </SliderTrack>
                                            <SliderThumb />
                                        </Slider>
                                        +50
                                    </Box>
                                </Box>
                                <Box>
                                    <Box className='text-lg font-semibold mb-2 mt-5'>Animation Speed</Box>
                                    <Box className='text-sm flex gap-5 items-center'>
                                        <GiTortoise className='text-4xl text-green-400' />
                                        <Slider defaultValue={animationSpeed} min={AnimationSpeed.SLOWEST} max={AnimationSpeed.FASTEST} onChange={(val) => setAnimationSpeed(val)} step={1}>
                                            <SliderTrack>
                                                <SliderFilledTrack />
                                            </SliderTrack>
                                            <SliderThumb />
                                        </Slider>
                                        <GiRabbit className='text-4xl text-pink-400' />
                                    </Box>
                                </Box>
                            </Box>
                        </ModalBody>
                        <ModalFooter >
                            <Button variant='outline' mr={3} onClick={onClose} colorScheme='black'>
                                Close
                            </Button>
                        </ModalFooter>
                    </Box>
                </ModalContent>
            </Modal >
        </>
    )
}

export default SettingsModal