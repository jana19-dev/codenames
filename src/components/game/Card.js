import {
  Text,
  VStack,
  IconButton,
  CircularProgress
} from '@chakra-ui/react'

import { GiSpy } from 'react-icons/gi'

export default function Card ({ word, loading }) {
  return (
    <VStack
      bgColor='white'
      height='100px'
      justifyContent='space-around'
      borderRadius='lg'
    >
      {loading && (
        <CircularProgress isIndeterminate color='teal.300' thickness='16px' />
      )}
      {!loading && (
        <>
          <IconButton
            size='sm'
            colorScheme='teal'
            aria-label='Reveal'
            fontSize='26px'
            icon={<GiSpy />}
          />
          <Text fontWeight='bold'>{word.label}</Text>
        </>
      )}
    </VStack>
  )
}
