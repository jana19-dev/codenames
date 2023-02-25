import { useEffect, useRef } from 'react'

import database from 'utils/firebase'

import {
  Flex,
  Text
} from '@chakra-ui/react'

export default function StatusText ({ room }) {
  const timer = useRef()

  const visitorID = window.localStorage.getItem('visitorID')
  const roomOwnerVisitorID = room.owner

  useEffect(() => {
    if (visitorID === roomOwnerVisitorID && !room.game.turn.includes('won')) {
      timer.current = setInterval(async () => {
        if (!room.state.waiting) {
          if (room.state.timer >= 120) {
            // end round
            clearInterval(timer.current)
            room.state.timer && await database().ref('rooms').child(room.name).child('state').update({ timer: null, timeout: true })
          } else {
            database().ref('rooms').child(room.name).child('state').update({ timer: room.state.timer + 1 })
          }
        }
      }, 1000)
      if (room.state.waiting) {
        clearInterval(timer.current)
      }
    } else {
      timer.current && clearInterval(timer.current)
    }
    return () => {
      clearInterval(timer.current)
    }
  }, [room.state.timer, room.state.waiting])

  const currentUser = room.users[visitorID]

  let text = ''
  if (room.game.turn === 'red_spymaster') {
    if (currentUser.team === 'red') {
      if (currentUser.role === 'spymaster') {
        text = 'Give your operatives a clue'
      } else if (currentUser.role === 'operative') {
        text = 'Waiting for your spymaster to give a clue'
      } else {
        text = 'Waiting for RED spymaster to give a clue'
      }
    } else if (currentUser.team === 'blue') {
      text = 'Waiting for opponent spymaster to give a clue'
    } else {
      text = 'Waiting for RED spymaster to give a clue'
    }
  } else if (room.game.turn === 'blue_spymaster') {
    if (currentUser.team === 'blue') {
      if (currentUser.role === 'spymaster') {
        text = 'Give your operatives a clue'
      } else if (currentUser.role === 'operative') {
        text = 'Waiting for your spymasters to give a clue'
      } else {
        text = 'Waiting for BLUE spymasters to give a clue'
      }
    } else if (currentUser.team === 'red') {
      text = 'Waiting for opponent spymasters to give a clue'
    } else {
      text = 'Waiting for BLUE spymasters to give a clue'
    }
  } else if (room.game.turn === 'red_operative') {
    if (currentUser.team === 'red') {
      if (currentUser.role === 'spymaster') {
        text = 'Waiting for your operatives to guess words'
      } else if (currentUser.role === 'operative') {
        text = 'Try to guess some words'
      } else {
        text = 'Waiting for RED operatives to guess words'
      }
    } else if (currentUser.team === 'blue') {
      text = 'Waiting for opponent operatives to guess words'
    } else {
      text = 'Waiting for RED operatives to guess words'
    }
  } else if (room.game.turn === 'blue_operative') {
    if (currentUser.team === 'blue') {
      if (currentUser.role === 'spymaster') {
        text = 'Waiting for your operatives to guess words'
      } else if (currentUser.role === 'operative') {
        text = 'Try to guess some words'
      } else {
        text = 'Waiting for RED operatives to guess words'
      }
    } else if (currentUser.team === 'red') {
      text = 'Waiting for opponent operatives to guess words'
    } else {
      text = 'Waiting for RED operatives to guess words'
    }
  } else if (room.game.turn.includes('won')) {
    if (room.game.turn === 'red_won') {
      text = 'Red team wins! 😎'
    } else {
      text = 'Blue team wins! 😎'
    }
  } else {
    text = 'Room owner is setting up the game'
  }

  return (
    <Flex
      borderRadius='xl'
      bgGradient='linear(to-r, red.600, orange.600)'
      width='fit-content'
      p={2}
      color='white'
      alignItems='center'
    >
      <Text
        fontWeight='bold'
        fontSize={['sm', 'lg', '2xl']}
        letterSpacing={['0.5px', '1px']}
        textAlign='center'
      >
        {text}
      </Text>
      {Boolean(room.state.timer) && (
        <Text
          ml={2}
          px={1}
          fontWeight='bold'
          fontSize={['sm', 'lg', '2xl']}
          letterSpacing={['0.5px', '1px']}
          textAlign='center'
          bgGradient='linear(to-r, red.800, red.900)'
          borderRadius='xl'
        >
          {120 - room.state.timer}s
        </Text>
      )}
    </Flex>
  )
}
