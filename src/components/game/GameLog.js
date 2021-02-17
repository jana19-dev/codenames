import { useRef, useEffect } from 'react'

import {
  Text,
  VStack,
  useBreakpointValue
} from '@chakra-ui/react'

export default function GameLog ({ room, roomData }) {
  const isDesktop = useBreakpointValue({ lg: true })

  const logsEndRef = useRef()

  useEffect(() => {
    isDesktop && logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <VStack
      width='100%'
      height={['350px', '380px']}
      maxW={['100%', '450px']}
      bgGradient='radial(rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.75))'
      color='white'
      borderRadius='lg'
    >
      <Text fontWeight='bold' mt={2}>Game Log</Text>
      {roomData.logs && (
        <VStack
          spacing={1}
          width='100%'
          overflow='auto'
        >
          {roomData.logs.map((log, idx) => {
            return (
              <Text
                key={idx}
                width='100%'
                px={2}
                py={2}
                borderRadius='lg'
                bgGradient='radial(rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.75))'
              >
                {log}
              </Text>
            )
          })}
          <div ref={logsEndRef} />
        </VStack>
      )}
    </VStack>
  )
}
