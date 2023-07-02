import type { NextPage } from 'next'
import { Box, Button, Heading } from '@chakra-ui/react'
import { Toolbar } from '../components/Toolbar'
import { World } from '../components/World'
import { useEffect, useState } from 'react'
import { TileState } from '../dijkstra/Tile'

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
  }, [])

  return (
    <Box className='flex flex-col min-h-screen' backgroundColor={'#1e1e1e'}>
      <Box className='flex items-center mx-20 my-10'>
        <Heading as='h1'>Pathfinding Visualizer</Heading>
      </Box>
      <World isShiftKeyPressed={isShiftKeyPressed} />
    </Box>
  )
}

export default Home
