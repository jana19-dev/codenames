import {
  Grid,
  Button,
  VStack,
  HStack,
  CircularProgress
} from '@chakra-ui/react'

import GenerateWords from 'components/game/GenerateWords'

import StatusText from 'components/game/StatusText'

import StyledText from 'components/game/StyledText'

import Card from 'components/game/Card'

import ClueInput from 'components/game/ClueInput'
import ClueText from 'components/game/ClueText'

export default function Board ({ room, roomData, playSound }) {
  const visitorID = window.localStorage.getItem('visitorID')
  const roomOwnerVisitorID = roomData.owner

  const currentUser = roomData.users[visitorID]
  const roomOwner = roomData.users[roomData.owner]

  const onEndGuess = () => {
    playSound()
    const currentTurn = roomData.state.turn
    room.child('state').update({
      clue: null,
      count: null,
      turn: currentTurn === 'red_operative' ? 'blue_spymaster' : 'red_spymaster'
    })
    const color = currentUser.team === 'blue' ? '🔵 ' : '🔴'
    room.child('logs').push(`${color} ${currentUser.nickname} clicks end guessing`)
  }

  const onResetTeams = () => {
    playSound()
    for (const visitorID of Object.keys(roomData.users)) {
      const user = room.child('users').child(visitorID)
      user.update({ team: null, role: null })
    }
  }

  const onResetGame = () => {
    playSound()
    onResetTeams()
    room.child('state').set({
      turn: 'generating_words'
    })
    room.child('words').set(null)
    room.child('logs').push(`⚪ ${roomOwner.nickname} has reset the game`)
  }

  let showClueInput = false
  if (roomData.state.turn === 'red_spymaster') {
    if (currentUser.team === 'red' && currentUser.role === 'spymaster') {
      showClueInput = true
    }
  } else if (roomData.state.turn === 'blue_spymaster') {
    if (currentUser.team === 'blue' && currentUser.role === 'spymaster') {
      showClueInput = true
    }
  }

  let showEndGuess = false
  if (roomData.state.turn === 'red_operative') {
    if (currentUser.team === 'red' && currentUser.role === 'operative') {
      showEndGuess = true
    }
  } else if (roomData.state.turn === 'blue_operative') {
    if (currentUser.team === 'blue' && currentUser.role === 'operative') {
      showEndGuess = true
    }
  }

  if (roomData.state.turn === 'generating_words' && roomOwnerVisitorID === visitorID) {
    return (
      <GenerateWords room={room} />
    )
  }

  if (roomData.state.turn === 'generating_words' && roomOwnerVisitorID !== visitorID) {
    return (
      <VStack justifyContent='center'>
        <CircularProgress isIndeterminate color='yellow.300' thickness='18px' size='48px' />
      </VStack>
    )
  }

  return (
    <VStack spacing={4}>
      <StatusText room={room} roomData={roomData} />
      <Grid
        templateColumns='1fr 1fr 1fr 1fr 1fr'
        gap={[1, 2]}
        height='fit-content'
        width='100%'
      >
        {Object.values(roomData.words).map((word, idx) => (
          <Card
            key={idx}
            word={word}
            room={room}
            roomData={roomData}
            playSound={playSound}
          />
        ))}
      </Grid>
      {showClueInput && <ClueInput room={room} roomData={roomData} playSound={playSound} />}
      {!showClueInput && roomData.state.clue && (
        <HStack alignItems='center'>
          <ClueText clue={roomData.state.clue} count={roomData.state.count} />
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
      {roomData.state.turn.includes('won') && currentUser.visitorID === roomOwner.visitorID && (
        <Button colorScheme='yellow' onClick={onResetGame}>
          PLAY NEXT GAME
        </Button>
      )}
      {roomData.state.turn.includes('won') && currentUser.visitorID !== roomOwner.visitorID && (
        <StyledText value='Waiting for room owner to reset the game' />
      )}
      {(!currentUser.team || !currentUser.role) && (
        <StyledText value='Join a team to play' />
      )}
    </VStack>

  )
}
