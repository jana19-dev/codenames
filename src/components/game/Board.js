import {
  Grid,
  Button,
  VStack,
  HStack,
  CircularProgress
} from '@chakra-ui/react'

import firebase from 'utils/firebase'

import GenerateWords from 'components/game/GenerateWords'

import StatusText from 'components/game/StatusText'

import StyledText from 'components/game/StyledText'

import Card from 'components/game/Card'

import ClueInput from 'components/game/ClueInput'
import ClueText from 'components/game/ClueText'

export default function Board ({ room, playSound }) {
  const visitorID = window.localStorage.getItem('visitorID')
  const roomOwnerVisitorID = room.owner

  const currentUser = room.users[visitorID]
  const roomOwner = room.users[room.owner]

  const onEndGuess = () => {
    playSound()
    const currentTurn = room.state.turn
    firebase.ref('rooms').child(room.name).child('state').update({
      clue: null,
      count: null,
      turn: currentTurn === 'red_operative' ? 'blue_spymaster' : 'red_spymaster'
    })
    const color = currentUser.team === 'blue' ? '🔵 ' : '🔴'
    firebase.ref('rooms').child(room.name).child('logs').push(`${color} ${currentUser.nickname} clicks end guessing`)
  }

  const onResetTeams = () => {
    playSound()
    for (const visitorID of Object.keys(room.users)) {
      const user = firebase.ref('rooms').child(room.name).child('users').child(visitorID)
      user.update({ team: null, role: null })
    }
  }

  const onResetGame = () => {
    playSound()
    onResetTeams()
    firebase.ref('rooms').child(room.name).child('state').set({
      turn: 'generating_words'
    })
    firebase.ref('rooms').child(room.name).child('words').set(null)
    firebase.ref('rooms').child(room.name).child('logs').push(`⚪ ${roomOwner.nickname} has reset the game`)
  }

  let showClueInput = false
  if (room.state.turn === 'red_spymaster') {
    if (currentUser.team === 'red' && currentUser.role === 'spymaster') {
      showClueInput = true
    }
  } else if (room.state.turn === 'blue_spymaster') {
    if (currentUser.team === 'blue' && currentUser.role === 'spymaster') {
      showClueInput = true
    }
  }

  let showEndGuess = false
  if (room.state.turn === 'red_operative') {
    if (currentUser.team === 'red' && currentUser.role === 'operative') {
      showEndGuess = true
    }
  } else if (room.state.turn === 'blue_operative') {
    if (currentUser.team === 'blue' && currentUser.role === 'operative') {
      showEndGuess = true
    }
  }

  if (room.state.turn === 'generating_words' && roomOwnerVisitorID === visitorID) {
    return (
      <GenerateWords room={room} />
    )
  }

  if (room.state.turn === 'generating_words' && roomOwnerVisitorID !== visitorID) {
    return (
      <VStack justifyContent='center'>
        <CircularProgress isIndeterminate color='yellow.300' thickness='18px' size='48px' />
      </VStack>
    )
  }

  return (
    <VStack spacing={4}>
      <StatusText room={room} />
      <Grid
        templateColumns='1fr 1fr 1fr 1fr 1fr'
        gap={[1, 2]}
        height='fit-content'
        width='100%'
      >
        {Object.values(room.words).map((word, idx) => (
          <Card
            key={idx}
            word={word}
            room={room}
            playSound={playSound}
          />
        ))}
      </Grid>
      {showClueInput && <ClueInput room={room} playSound={playSound} />}
      {!showClueInput && room.state.clue && (
        <HStack alignItems='center'>
          <ClueText clue={room.state.clue} count={room.state.count} />
          {showEndGuess && (
            <Button
              size='lg'
              colorScheme='yellow'
              onClick={onEndGuess}
            >
              End Guess
            </Button>
          )}
        </HStack>
      )}
      {room.state.turn.includes('won') && currentUser.visitorID === roomOwner.visitorID && (
        <Button colorScheme='yellow' onClick={onResetGame}>
          PLAY NEXT GAME
        </Button>
      )}
      {room.state.turn.includes('won') && currentUser.visitorID !== roomOwner.visitorID && (
        <StyledText value='Waiting for room owner to reset the game' />
      )}
      {(!currentUser.team || !currentUser.role) && (
        <StyledText value='Join a team to play' />
      )}
    </VStack>

  )
}
