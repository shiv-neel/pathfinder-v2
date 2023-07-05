import { ChakraProvider } from '@chakra-ui/react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CacheProvider } from '@chakra-ui/next-js'
import { theme } from '../styles/theme'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<CacheProvider>
			<ChakraProvider theme={theme}>
				<Component {...pageProps} />
			</ChakraProvider>
		</CacheProvider>
	)
}

export default MyApp
