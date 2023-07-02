import { ChakraProvider } from '@chakra-ui/react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CacheProvider } from '@chakra-ui/next-js'
import { theme } from '../styles/theme'
import { AppContextProvider } from '../components/AppContext'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<CacheProvider>
			<ChakraProvider theme={theme}>
				<AppContextProvider>
					<Component {...pageProps} />
				</AppContextProvider>
			</ChakraProvider>
		</CacheProvider>
	)
}

export default MyApp
