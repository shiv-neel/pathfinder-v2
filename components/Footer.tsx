import { Box } from '@chakra-ui/react'
import Link from 'next/link'
import { BsSuitHeartFill } from 'react-icons/bs'

const Footer = () => {
    return (
        // <Link href='https://shivneel.me'>
        <Box className='flex justify-center items-center gap-2 mt-5'>
            Made with <BsSuitHeartFill className='text-red-600' /> by Shiv Neelakantan
        </Box>
        // </Link>
    )
}

export default Footer   