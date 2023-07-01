import React, { useEffect, useState } from 'react'
import { Box, Grid } from '@chakra-ui/react'
import { Tile, TileState } from '../dijkstra/Tile'
import { GridTile } from './GridTile'
import { Node, Pathfinder } from '../dijkstra/Pathfinder'

interface WorldProps {
}

export const World: React.FC<WorldProps> = ({ }) => {
    const pathfinder = new Pathfinder()
    const [tiles, setTiles] = useState<Tile[][]>(pathfinder.getMatrix())
    const [distances, setDistances] = useState<number[][]>([])
    const [parents, setParents] = useState<Node[][]>([])

    useEffect(() => {
        pathfinder.generateDistanceMatrix(13, 10, 13, 40)
        setDistances(pathfinder.getDistances())
        setParents(pathfinder.getParents())
        pathfinder.getSequence(13, 10, 13, 40)
    }, [])



    return <Box className='flex justify-center'><Grid templateColumns='repeat(50, 1fr)' className='mx-20 my-10'>
        {tiles.map((tileRow) => tileRow.map((tile) => <GridTile key={Math.random()}
            pathfinder={pathfinder}
            parents={parents}
            distances={distances} tile={tile} />))}
    </Grid></Box>

}