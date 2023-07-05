import { Box } from '@chakra-ui/react'
import { BsSuitHeartFill } from 'react-icons/bs'

const Footer = () => {
    return (
        <Box className='flex justify-center items-center gap-2 mt-5'>
            Made with <BsSuitHeartFill className='text-red-600' /> by Shiv Neelakantan
        </Box>
    )
}

export default Footer   