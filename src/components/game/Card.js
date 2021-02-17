import {
  Flex,
  Text,
  IconButton,
  useBreakpointValue
} from '@chakra-ui/react'

import { FaHandPointUp } from 'react-icons/fa'
import { GoLightBulb } from 'react-icons/go'

import redPNG from 'images/red.png'
import bluePNG from 'images/blue.png'
import doublePNG from 'images/double.png'
import bystanderPNG from 'images/bystander.png'

export default function Card ({ word, room, roomData }) {
  const isDesktop = useBreakpointValue({ md: true })

  const visitorID = window.localStorage.getItem('visitorID')
  const currentUser = roomData.users[visitorID]

  let canGuess = false
  if (roomData.state.turn === 'red_operative') {
    if (currentUser.team === 'red' && currentUser.role === 'operative') {
      canGuess = true
    }
  } else if (roomData.state.turn === 'blue_operative') {
    if (currentUser.team === 'blue' && currentUser.role === 'operative') {
      canGuess = true
    }
  }
  if (word.guessed) {
    canGuess = false
  }

  let bgColor = 'white'
  let color = 'black'
  let bgGradient = ''
  let alignItems = 'center'
  if (currentUser.role === 'spymaster') {
    bgColor = `${word.agent === 'red' ? '#9B2C2C' : word.agent === 'blue' ? '#2c5282' : word.agent === 'double' ? 'black' : '#f3d8b5'}`
    color = 'white'
    bgGradient = 'radial(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.55))'
  }
  if (roomData.state.turn.includes('operative') && currentUser.role === 'operative') {
    alignItems = 'flex-end'
  }

  let cardBackground = {}
  if (word.guessed) {
    const bgURL = word.agent === 'red' ? redPNG : word.agent === 'blue' ? bluePNG : word.agent === 'bystander' ? bystanderPNG : doublePNG
    cardBackground = {
      bg: `url(${bgURL})`,
      bgSize: '100% 100%'
    }
  }

  const onHint = () => {
    
  }

  const onGuess = () => {

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
      {...cardBackground}
    >
      {canGuess && (
        <>
          <IconButton
            position='absolute'
            top={2}
            left={2}
            size={isDesktop ? 'md' : 'xs'}
            colorScheme='white'
            aria-label='Reveal'
            fontSize='22px'
            icon={<GoLightBulb color='black' />}
            onClick={onHint}
          />
          <IconButton
            position='absolute'
            top={2}
            right={2}
            size={isDesktop ? 'md' : 'xs'}
            colorScheme='yellow'
            aria-label='Reveal'
            fontSize='22px'
            icon={<FaHandPointUp />}
            onClick={onGuess}
          />
        </>
      )}
      {!word.guessed && (
        <Text fontWeight='bold' fontSize={['8px', 'xs', 'sm', 'lg']} textAlign='center'>
          {word.label}
        </Text>
      )}
    </Flex>
  )
}
