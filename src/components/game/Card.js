import { useEffect } from 'react'

import firebase from 'utils/firebase'

import {
  Flex,
  Text,
  Badge,
  VStack,
  IconButton,
  useBreakpointValue,
  HStack
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
    bgColor = `${word.agent === 'red' ? '#a32424' : word.agent === 'blue' ? '#4896f9' : word.agent === 'double' ? 'black' : '#f3d8b5'}`
    color = 'white'
    bgGradient = 'radial(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.55))'
  }
  if (room.state.turn.includes('operative') && currentUser.role === 'operative') {
    alignItems = 'flex-start'
  }
  if (word.guessed && !room.state.turn.includes('won')) {
    alignItems = 'flex-end'
  }

  let cardBackground = {}
  if (word.guessed) {
    color = 'white'
    const bgURL = word.agent === 'red' ? redPNG : word.agent === 'blue' ? bluePNG : word.agent === 'bystander' ? bystanderPNG : doublePNG
    cardBackground = {
      bg: `url(${bgURL})`,
      bgSize: '100% 100%'
    }
  }

  const onHint = async () => {
    await playSound()
    let hints = word.hints ? [...word.hints] : []
    if (hints.includes(currentUser.nickname)) {
      hints = hints.filter(hintedBy => hintedBy !== currentUser.nickname)
    } else {
      hints = [...hints, currentUser.nickname]
    }
    await firebase.ref('rooms').child(room.name).child('words').child(word.label).update({
      hints
    })
  }

  const onGuess = async () => {
    await playSound()
    await cardControls.start({
      rotateY: 360
    })
    await firebase.ref('rooms').child(room.name).child('words').child(word.label).update({
      guessed: true
    })
    if (currentUser.team !== word.agent) {
      const color = currentUser.team === 'blue' ? '🔵 ' : '🔴'
      await firebase.ref('rooms').child(room.name).child('logs').push(`${color} ${currentUser.nickname} taps ${word.label} 😭 `)
      const currentTurn = room.state.turn
      if (word.agent === 'double') {
        // game over
        await firebase.ref('rooms').child(room.name).child('state').update({
          clue: null,
          count: null,
          turn: currentUser.team === 'red' ? 'blue_won' : 'red_won'
        })
        if (currentUser.team === 'red') {
          await firebase.ref('rooms').child(room.name).child('logs').push('⚪ Blue team wins! 😎 ')
        } else {
          await firebase.ref('rooms').child(room.name).child('logs').push('⚪ Red team wins! 😎 ')
        }
      } else {
        // clear hints
        for (const word of Object.keys(room.words)) {
          await firebase.ref('rooms').child(room.name).child('words').child(word).update({ hints: null })
        }
        await firebase.ref('rooms').child(room.name).child('state').update({
          clue: null,
          count: null,
          turn: currentTurn === 'red_operative' ? 'blue_spymaster' : 'red_spymaster'
        })
      }
    } else {
      const color = currentUser.team === 'blue' ? '🔵 ' : '🔴'
      await firebase.ref('rooms').child(room.name).child('logs').push(`${color} ${currentUser.nickname} taps ${word.label} 😍`)
      // check if either team has guessed all words
      const remainingBlueCount = room.words && Object.values(room.words).filter(({ label, agent, guessed }) => agent === 'blue' && !guessed && label !== word.label).length
      const remainingRedCount = room.words && Object.values(room.words).filter(({ label, agent, guessed }) => agent === 'red' && !guessed && label !== word.label).length
      if (remainingBlueCount === 0) {
        // blue won
        await firebase.ref('rooms').child(room.name).child('state').update({
          clue: null,
          count: null,
          turn: 'blue_won'
        })
        await firebase.ref('rooms').child(room.name).child('logs').push('⚪ Blue team wins! 😎 ')
      } else if (remainingRedCount === 0) {
        // red won
        await firebase.ref('rooms').child(room.name).child('state').update({
          clue: null,
          count: null,
          turn: 'red_won'
        })
        await firebase.ref('rooms').child(room.name).child('logs').push('⚪ Red team wins! 😎 ')
      }
    }
  }

  return (
    <MotionCard
      bgGradient={bgGradient}
      bgColor={bgColor}
      color={color}
      alignItems={alignItems}
      justifyContent='center'
      borderRadius='lg'
      minH={['60px', '120px']}
      letterSpacing='1px'
      animate={cardControls}
      transition={{ duration: 1 }}
      p={1}
      {...cardBackground}
    >
      <VStack justifyContent={(canGuess || room.state.turn.includes('won') || word.guessed) ? 'flex-end' : 'center'} width='100%'>
        {canGuess && (
          <Flex justifyContent='space-between' width='100%'>
            <IconButton
              size={isDesktop ? 'md' : 'xs'}
              colorScheme={word.hints && word.hints.includes(currentUser.nickname) ? 'yellow' : 'white'}
              aria-label='Reveal'
              fontSize={['14px', '22px']}
              icon={<GoLightBulb color='black' />}
              onClick={onHint}
            />
            <IconButton
              size={isDesktop ? 'md' : 'xs'}
              colorScheme='yellow'
              aria-label='Reveal'
              fontSize={['14px', '22px']}
              icon={<FaHandPointUp />}
              onClick={onGuess}
            />
          </Flex>
        )}
        <Text
          fontWeight='bold'
          fontSize={['8px', 'xs', 'sm', 'lg']}
          textAlign='center'
          bgGradient={room.state.turn.includes('won') || word.guessed ? 'radial(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.55))' : 'none'}
          px={1}
        >
          {word.label}
        </Text>
        {canGuess && word.hints && (
          <HStack maxW={['80px', '150px']} overflowX='auto'>
            {word.hints.map(hintedBy => (
              <Badge
                key={hintedBy}
                colorScheme={currentUser.team === 'blue' ? 'blue' : currentUser.team === 'red' ? 'red' : 'gray'}
                fontSize={['8px', 'sm']}
              >
                {hintedBy}
              </Badge>
            ))}
          </HStack>
        )}
      </VStack>
    </MotionCard>
  )
}
