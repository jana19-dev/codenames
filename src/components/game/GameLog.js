import { useRef, useEffect } from 'react'

import {
  Text,
  VStack,
  useBreakpointValue
} from '@chakra-ui/react'

export default function GameLog ({ room, playSound }) {
  const isDesktop = useBreakpointValue({ xl: true })

  const logsEndRef = useRef()

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollTop = logsEndRef.current.scrollHeight
    }
  }, [isDesktop, room])

  return (
    <VStack
      width='100%'
      height={['280px', '380px']}
      w={['100%', '100%', '420px']}
      bgGradient='radial(rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.75))'
      color='white'
      borderRadius='lg'
      overflowX='hidden'
    >
      <Text fontWeight='bold' mt={2}>Game Log</Text>
      {room.logs && (
        <VStack
          spacing={1}
          width='100%'
          overflow='auto'
          ref={logsEndRef}
        >
          {Object.values(room.logs).map((log, idx) => {
            return (
              <Text
                key={idx}
                width='100%'
                fontSize={['xs', 'sm']}
                px={2}
                py={[0, 2]}
                borderRadius='lg'
                bgGradient='radial(rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.75))'
                fontWeight='bold'
              >
                <code>{log}</code>
              </Text>
            )
          })}
        </VStack>
      )}
    </VStack>
  )
}
