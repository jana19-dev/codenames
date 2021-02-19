import { useEffect } from 'react'

import firebase from 'utils/firebase'

import {
  Flex,
  Text,
  Badge,
  VStack,
  IconButton,
  useBreakpointValue
} from '@chakra-ui/react'

import { FaHandPointUp } from 'react-icons/fa'
import { GoLightBulb } from 'react-icons/go'

import redPNG from 'images/red.png'
import bluePNG from 'images/blue.png'
import doublePNG from 'images/double.png'
import bystanderPNG from 'images/bystander.png'

import { motion, useAnimation } from 'framer-motion'

const MotionCard = motion.custom(Flex)

export default function Card ({ word, room, playSound }) {
  const cardControls = useAnimation()

  const isDesktop = useBreakpointValue({ md: true })

  useEffect(() => {
    if (word.guessed) {
      cardControls.start({
        rotateY: 360
      })
    }
  }, [word.guessed])

  const visitorID = window.localStorage.getItem('visitorID')
  const currentUser = room.users[visitorID]

  let canGuess = false
  if (room.state.turn === 'red_operative') {
    if (currentUser.team === 'red' && currentUser.role === 'operative') {
      canGuess = true
    }
  } else if (room.state.turn === 'blue_operative') {
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
  if (currentUser.role === 'spymaster' || room.state.turn.includes('won')) {
    bgColor = `${word.agent === 'red' ? '#9B2C2C' : word.agent === 'blue' ? '#2c5282' : word.agent === 'double' ? 'black' : '#f3d8b5'}`
    color = 'white'
    bgGradient = 'radial(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.55))'
  }
  if (room.state.turn.includes('operative') && currentUser.role === 'operative') {
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
    playSound()
    let hints = word.hints ? [...word.hints] : []
    if (hints.includes(currentUser.nickname)) {
      hints = hints.filter(hintedBy => hintedBy !== currentUser.nickname)
    } else {
      hints = [...hints, currentUser.nickname]
    }
    firebase.ref('rooms').child(room.name).child('words').child(word.label).update({
      hints
    })
  }

  const onGuess = async () => {
    await playSound()
    await cardControls.start({
      rotateY: 360
    })
    firebase.ref('rooms').child(room.name).child('words').child(word.label).update({
      guessed: true
    })
      .then(() => {
        if (currentUser.team !== word.agent) {
          const color = currentUser.team === 'blue' ? '🔵 ' : '🔴'
          firebase.ref('rooms').child(room.name).child('logs').push(`${color} ${currentUser.nickname} taps ${word.label} 😭 `)
          const currentTurn = room.state.turn
          if (word.agent === 'double') {
            // game over
            firebase.ref('rooms').child(room.name).child('state').update({
              clue: null,
              count: null,
              turn: currentUser.team === 'red' ? 'blue_won' : 'red_won'
            })
            if (currentUser.team === 'red') {
              firebase.ref('rooms').child(room.name).child('logs').push('⚪ Blue team wins! 😎 ')
            } else {
              firebase.ref('rooms').child(room.name).child('logs').push('⚪ Red team wins! 😎 ')
            }
          } else {
            firebase.ref('rooms').child(room.name).child('state').update({
              clue: null,
              count: null,
              turn: currentTurn === 'red_operative' ? 'blue_spymaster' : 'red_spymaster'
            })
          }
        } else {
          const color = currentUser.team === 'blue' ? '🔵 ' : '🔴'
          firebase.ref('rooms').child(room.name).child('logs').push(`${color} ${currentUser.nickname} taps ${word.label} 😍`)
          // check if either team has guessed all words
          const remainingBlueCount = room.words && Object.values(room.words).filter(({ label, agent, guessed }) => agent === 'blue' && !guessed && label !== word.label).length
          const remainingRedCount = room.words && Object.values(room.words).filter(({ label, agent, guessed }) => agent === 'red' && !guessed && label !== word.label).length
          if (remainingBlueCount === 0) {
            // blue won
            firebase.ref('rooms').child(room.name).child('state').update({
              clue: null,
              count: null,
              turn: 'blue_won'
            })
            firebase.ref('rooms').child(room.name).child('logs').push('⚪ Blue team wins! 😎 ')
          } else if (remainingRedCount === 0) {
            // red won
            firebase.ref('rooms').child(room.name).child('state').update({
              clue: null,
              count: null,
              turn: 'red_won'
            })
            firebase.ref('rooms').child(room.name).child('logs').push('⚪ Red team wins! 😎 ')
          }
        }
      })
  }

  return (
    <MotionCard
      bgGradient={bgGradient}
      bgColor={bgColor}
      color={color}
      alignItems={alignItems}
      justifyContent='center'
      borderRadius='lg'
      height={['60px', '120px']}
      position='relative'
      letterSpacing='1px'
      animate={cardControls}
      transition={{ duration: 1 }}
      {...cardBackground}
    >
      {(!word.guessed || room.state.turn.includes('won')) && (
        <>
          {canGuess && (
            <>
              <IconButton
                position='absolute'
                top={2}
                left={2}
                size={isDesktop ? 'md' : 'xs'}
                colorScheme={word.hints && word.hints.includes(currentUser.nickname) ? 'yellow' : 'white'}
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
          <VStack height='90%' justifyContent={(canGuess || room.state.turn.includes('won')) ? 'flex-end' : 'center'}>
            {canGuess && word.hints && (
              <>
                {word.hints.map(hintedBy => (
                  <Badge
                    key={hintedBy}
                    colorScheme={currentUser.team === 'blue' ? 'blue' : currentUser.team === 'red' ? 'red' : 'gray'}
                  >
                    {hintedBy}
                  </Badge>
                ))}
              </>
            )}
            {(!word.guessed || room.state.turn.includes('won')) && (
              <Text
                fontWeight='bold'
                fontSize={['8px', 'xs', 'sm', 'lg']}
                textAlign='center'
                background={room.state.turn.includes('won') ? 'black' : 'none'}
                p={room.state.turn.includes('won') ? 1 : 0}
              >
                {word.label}
              </Text>
            )}
          </VStack>
        </>
      )}
    </MotionCard>
  )
}
