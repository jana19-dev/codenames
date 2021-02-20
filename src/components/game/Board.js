import { useEffect } from 'react'

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

  useEffect(() => {
    (async () => {
      if (room.state.timeout && visitorID === roomOwnerVisitorID) {
        const resetState = { clue: null, count: null, timeout: null, timer: null }
        clearHints()
        if (room.state.turn === 'red_spymaster') {
          const user = Object.values(room.users).find(user => user.team === 'red' && user.role === 'spymaster')
          await firebase.ref('rooms').child(room.name).child('logs').push(`🔴  ${user.nickname} ran out of time to give a clue ⏱️`)
          await firebase.ref('rooms').child(room.name).child('state').update({
            ...resetState,
            turn: 'blue_spymaster'
          })
        } else if (room.state.turn === 'blue_spymaster') {
          const user = Object.values(room.users).find(user => user.team === 'blue' && user.role === 'spymaster')
          await firebase.ref('rooms').child(room.name).child('logs').push(`🔵  ${user.nickname} ran out of time to give a clue ⏱️`)
          await firebase.ref('rooms').child(room.name).child('state').update({
            ...resetState,
            turn: 'red_spymaster'
          })
        } else if (room.state.turn.includes('operative')) {
          let remainingBlueCount = room.words && Object.values(room.words).filter(({ agent, guessed }) => agent === 'blue' && !guessed).length
          let remainingRedCount = room.words && Object.values(room.words).filter(({ agent, guessed }) => agent === 'red' && !guessed).length
          if (room.state.turn === 'red_operative') {
            const user = Object.values(room.users).find(user => user.team === 'red' && user.role === 'operative')
            await firebase.ref('rooms').child(room.name).child('logs').push(`🔴  ${user.nickname} ran out of time to guess ⏱️`)
            // reveal one of the opposite agent
            const remainingBlue = Object.values(room.words).filter(({ agent, guessed }) => agent === 'blue' && !guessed)
            await firebase.ref('rooms').child(room.name).child('words').child(remainingBlue[0].label).update({
              guessed: true
            })
            await firebase.ref('rooms').child(room.name).child('logs').push(`🤖  reveals blue agent ${remainingBlue[0].label} ⏱️`)
            remainingBlueCount -= 1
          } else {
            const user = Object.values(room.users).find(user => user.team === 'blue' && user.role === 'operative')
            await firebase.ref('rooms').child(room.name).child('logs').push(`🔵  ${user.nickname} ran out of time to guess ⏱️`)
            // reveal one of the opposite agent
            const remainingRed = Object.values(room.words).filter(({ agent, guessed }) => agent === 'red' && !guessed)
            await firebase.ref('rooms').child(room.name).child('words').child(remainingRed[0].label).update({
              guessed: true
            })
            await firebase.ref('rooms').child(room.name).child('logs').push(`🤖  reveals red agent ${remainingRed[0].label} ⏱️`)
            remainingRedCount -= 1
          }
          // check if either team has guessed all words
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
          } else {
            await firebase.ref('rooms').child(room.name).child('state').update({
              ...resetState,
              turn: room.state.turn === 'red_operative' ? 'blue_spymaster' : 'red_spymaster'
            })
          }
        }
      }
    })()
  }, [room.state.timeout])

  useEffect(() => {
    (async () => {
      if (!room.state.timer && !room.state.timeout) {
        // const now = new Date().getTime()
        await firebase.ref('rooms').child(room.name).child('state').update({ timer: 0, timeout: null, updating: null })
      }
    })()
  }, [room.state.turn])

  const clearHints = async () => {
    for (const word of Object.keys(room.words)) {
      await firebase.ref('rooms').child(room.name).child('words').child(word).update({ hints: null })
    }
  }

  const onEndGuess = async () => {
    const color = currentUser.team === 'blue' ? '🔵 ' : '🔴'
    const currentTurn = room.state.turn
    await playSound()
    await firebase.ref('rooms').child(room.name).child('logs').push(`${color} ${currentUser.nickname} clicks end guessing`)
    // clear hints
    for (const word of Object.keys(room.words)) {
      await firebase.ref('rooms').child(room.name).child('words').child(word).update({ hints: null })
    }
    await firebase.ref('rooms').child(room.name).child('state').update({
      clue: null,
      count: null,
      timer: null,
      timeout: null,
      turn: currentTurn === 'red_operative' ? 'blue_spymaster' : 'red_spymaster'
    })
  }

  const onResetTeams = async () => {
    await playSound()
    for (const visitorID of Object.keys(room.users)) {
      await firebase.ref('rooms').child(room.name).child('users').child(visitorID).update({ team: null, role: null })
    }
  }

  const onResetGame = async () => {
    await playSound()
    await onResetTeams()
    firebase.ref('rooms').child(room.name).child('chat').push({
      nickname: `👑  ${roomOwner.nickname}`,
      message: 'resetting the game'
    })
    await firebase.ref('rooms').child(room.name).child('logs').set(null)
    await firebase.ref('rooms').child(room.name).child('state').set({
      turn: 'generating_words'
    })
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
