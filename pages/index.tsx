import type { NextPage } from 'next'
import { Box, Button, Heading } from '@chakra-ui/react'
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
        <Toolbar />
      </Box>
      <World isShiftKeyPressed={isShiftKeyPressed} />
      {/* <WelcomeModal /> */}
      <Footer />
    </Box>
  )
}

export default Home
