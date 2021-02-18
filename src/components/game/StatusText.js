import {
  Flex,
  Text
} from '@chakra-ui/react'

export default function StatusText ({ room, roomData }) {
  const visitorID = window.localStorage.getItem('visitorID')
  const currentUser = roomData.users[visitorID]

  let text = ''
  if (roomData.state.turn === 'red_spymaster') {
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
  } else if (roomData.state.turn === 'blue_spymaster') {
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
  } else if (roomData.state.turn === 'red_operative') {
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
  } else if (roomData.state.turn === 'blue_operative') {
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
  } else if (roomData.state.turn.includes('won')) {
    if (roomData.state.turn === 'red_won') {
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
      >
        {text}
      </Text>
    </Flex>
  )
}
