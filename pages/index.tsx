import type { NextPage } from 'next'
import { Box, Button } from '@chakra-ui/react'
import { Toolbar } from '../components/Toolbar'
import { World } from '../components/World'
import { useState } from 'react'
import { TileState } from '../dijkstra/Tile'

const Home: NextPage = () => {
  return (
    <Box className='flex flex-col min-h-screen' backgroundColor={'#1f1f1f1'}>
      <Toolbar />
      <World />
    </Box>
  )
}

export default Home
