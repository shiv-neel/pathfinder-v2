import type { NextPage } from 'next'
import { Box, Button, useColorMode } from '@chakra-ui/react'
import { Toolbar } from '../components/Toolbar'
import { World } from '../components/World'
import { useState } from 'react'
import { TileState } from '../dijkstra/Tile'

const Home: NextPage = () => {
  const { colorMode } = useColorMode()
  const [editingState, setEditingState] = useState(TileState.SRC)
  return (
    <Box className='flex flex-col min-h-screen' backgroundColor={'#121212'}>
      <Toolbar editingState={editingState} setEditingState={setEditingState} />
      <World />
    </Box>
  )
}

export default Home
