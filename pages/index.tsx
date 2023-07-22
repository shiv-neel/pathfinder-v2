import type { NextPage } from 'next'
import { Box, Button, Heading, useColorMode, useDisclosure } from '@chakra-ui/react'
import { Toolbar } from '../components/Toolbar'
import { World } from '../components/World'
import { useEffect, useState } from 'react'
import { TileState } from '../pathfinder/Tile'
import Footer from '../components/Footer'
import { useDrag } from 'react-dnd'
import WelcomeModal from '../components/WelcomeModal'
import { COLS } from '../pathfinder/main'



const Home: NextPage = () => {
  const [isShiftKeyPressed, setIsShiftKeyPressed] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()

  useEffect(() => {
    if (colorMode === 'light')
      toggleColorMode()
  })

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.shiftKey) {
      setIsShiftKeyPressed(true)
    }
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    if (!event.shiftKey) {
      setIsShiftKeyPressed(false)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isShiftKeyPressed])

  return (
    <Box className='flex flex-col min-h-screen mx-auto' backgroundColor={'#1e1e1e'}>
      <Box>
        <Toolbar onOpen={onOpen} />
      </Box>
      <World isMousePressed={isShiftKeyPressed} onOpenTutorial={onOpen} />
      <WelcomeModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      <Footer />
    </Box>
  )
}

export default Home
