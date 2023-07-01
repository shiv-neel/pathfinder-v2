import { extendTheme } from '@chakra-ui/react'

import '@fontsource/libre-franklin'

export const theme = extendTheme({
	fonts: {
		heading: 'Libre Franklin',
		body: 'Libre Franklin',
	},
	
})

export const getBackgroundHoverColor = (colorMode: string) => {
	return colorMode === 'light' ? 'bg-gray-100' : 'bg-gray-700'
}