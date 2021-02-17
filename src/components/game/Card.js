import {
  Flex,
  Text,
  IconButton,
  useBreakpointValue
} from '@chakra-ui/react'

import { FaHandPointUp } from 'react-icons/fa'
import { GoLightBulb } from 'react-icons/go'

export default function Card ({ word, room, roomData }) {
  const isDesktop = useBreakpointValue({ lg: true })

  const visitorID = window.localStorage.getItem('visitorID')
  const currentUser = roomData.users[visitorID]

  let bgColor = 'white'
  let color = 'black'
  let bgGradient = ''
  let alignItems = 'center'
  if (roomData.state.turn.includes('spymaster') && currentUser.role === 'spymaster') {
    bgColor = `${word.agent === 'red' ? '#9B2C2C' : word.agent === 'blue' ? '#2c5282' : word.agent === 'double' ? 'black' : '#f3d8b5'}`
    color = 'white'
    bgGradient = 'radial(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.55))'
  }
  if (roomData.state.turn.includes('operative') && currentUser.role === 'operative') {
    alignItems = 'flex-end'
  }

  return (
    <Flex
      bgGradient={bgGradient}
      bgColor={bgColor}
      color={color}
      alignItems={alignItems}
      justifyContent='center'
      borderRadius='lg'
      height={['60px', '120px']}
      position='relative'
      letterSpacing='1px'
    >
      {roomData.state.turn.includes('operative') && (
        <>
          <IconButton
            position='absolute'
            top={2}
            left={2}
            size={!isDesktop ? 'xs' : 'md'}
            colorScheme='white'
            aria-label='Reveal'
            fontSize={['16px', '26px']}
            icon={<GoLightBulb color='black' />}
          />
          <IconButton
            position='absolute'
            top={2}
            right={2}
            size={!isDesktop ? 'xs' : 'md'}
            colorScheme='teal'
            aria-label='Reveal'
            fontSize={['16px', '26px']}
            icon={<FaHandPointUp />}
          />
        </>
      )}
      <Text fontWeight='bold' fontSize={['8px', 'xs', 'sm', 'lg']} textAlign='center'>
        {word.label}
      </Text>
    </Flex>
  )
}
