import { Box } from '@chakra-ui/react'
import Link from 'next/link'
import { BsSuitHeartFill } from 'react-icons/bs'

const Footer = () => {
    return (
        <Box className='flex justify-center items-center gap-2 mt-5'>
            <Link href='https://github.com/shiv-neel'>
                Made with <BsSuitHeartFill className='text-red-600' /> by Shiv Neelakantan
            </Link>
        </Box>
    )
}

export default Footer   