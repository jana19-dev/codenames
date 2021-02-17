import {
  Grid,
  Button,
  VStack,
  HStack,
  CircularProgress
} from '@chakra-ui/react'

import GenerateWords from 'components/game/GenerateWords'

import StatusText from 'components/game/StatusText'

import Card from 'components/game/Card'

import ClueInput from 'components/game/ClueInput'
import ClueText from 'components/game/ClueText'

export default function Board ({ room, roomData }) {
  const visitorID = window.localStorage.getItem('visitorID')
  const roomOwnerVisitorID = roomData.owner

  const currentUser = roomData.users[visitorID]

  const onEndGuess = () => {
    console.log('END GUESS')
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
        <CircularProgress isIndeterminate color='teal.300' thickness='18px' size='48px' />
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
      >
        {Object.values(roomData.words).map((word, idx) => (
          <Card
            key={idx}
            word={word}
            room={room}
            roomData={roomData}
          />
        ))}
      </Grid>
      {showClueInput && <ClueInput room={room} />}
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
    </VStack>

  )
}
