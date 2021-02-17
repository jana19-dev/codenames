import {
  Text,
  VStack,
  IconButton,
  useBreakpointValue
} from '@chakra-ui/react'

import { GiSpy } from 'react-icons/gi'

export default function Card ({ word }) {
  const isDesktop = useBreakpointValue({ lg: true })

  return (
    <VStack
      bgColor='white'
      justifyContent='space-around'
      borderRadius='lg'
      height={['50px', '120px']}

    >
      <IconButton
        size={['xs', 'sm']}
        colorScheme='teal'
        aria-label='Reveal'
        fontSize={['18px', '26px']}
        icon={<GiSpy />}
      />
      <Text fontWeight='bold' fontSize={isDesktop ? 'lg' : '8px'} textAlign='center'>
        {word.label}
      </Text>
    </VStack>
  )
}
