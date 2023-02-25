import { useEffect } from 'react'

import database from 'utils/firebase'

import useRoomLogs from 'hooks/useRoomLogs'
import useUserDisconnect from 'hooks/useUserDisconnect'

import {
  Flex,
  Text,
  Grid,
  Link,
  Image,
  VStack,
  HStack,
  useBreakpointValue
} from '@chakra-ui/react'

import logoSVG from 'images/logo.svg'

import Settings from 'components/game/Settings'

import WaitingForPlayers from 'components/WaitingForPlayers'
import RoomOwnerInactive from 'components/RoomOwnerInactive'

import RedTeam from 'components/game/teams/RedTeam'
import BlueTeam from 'components/game/teams/BlueTeam'
import Board from 'components/game/Board'
import GameLog from 'components/game/GameLog'
import GameChat from 'components/game/GameChat'

const haveEnoughUsers = (users) => {
  let redSpymasters = 0
  let redOperatives = 0
  let blueSpymasters = 0
  let blueOperatives = 0
  for (const user of users) {
    if (user.team === 'red' && user.role === 'spymaster') {
      redSpymasters += 1
    } else if (user.team === 'red' && user.role === 'operative') {
      redOperatives += 1
    } else if (user.team === 'blue' && user.role === 'spymaster') {
      blueSpymasters += 1
    } else if (user.team === 'blue' && user.role === 'operative') {
      blueOperatives += 1
    }
  }
  return redSpymasters > 0 && redOperatives > 0 && blueSpymasters > 0 && blueOperatives > 0
}

export default function GameRoom ({ room, playSound }) {
  useUserDisconnect(room)

  const isDesktop = useBreakpointValue({ xl: true })

  const roomLogs = useRoomLogs(room)

  const roomOwner = room.owner

  useEffect(() => {
    // log users who join or leave
    const roomUsersRef = database().ref(`rooms/${room.name}/users`)
    roomUsersRef.on('child_changed', function (snapshot) {
      const changedUser = snapshot.val()
      if (!changedUser.lastOnline) {
        roomLogs.push(`${room.owner !== roomOwner ? '⚪ ' : '👑 '} ${changedUser.nickname} has joined the room`)
      } else if (changedUser.lastOnline) {
        roomLogs.push(`⚪  ${changedUser.nickname} has left the room`)
      }
    })

    // detect owner offline
    const roomOwnerLastOnlineRef = database().ref(`rooms/${room.name}/lastOnline`)
    roomOwnerLastOnlineRef.on('value', (snap) => {
      const isOffline = snap.val()
      if (isOffline && room.state !== 'SEARCHING_ROOM_OWNER') {
        database().ref(`rooms/${room.name}/state`).set('SEARCHING_ROOM_OWNER')
        roomLogs.push(`👑  ${room.users[roomOwner].nickname} has left the room`)
      }
      if (room.state === 'SEARCHING_ROOM_OWNER') {
        roomOwnerLastOnlineRef.off()
      }
    })
  }, [])

  const isRoomOwnerActive = !room.lastOnline

  const canStartGame = isRoomOwnerActive && haveEnoughUsers(Object.values(room.users))

  return (
    <Grid height='100vh' p={[2, 4]} placeItems='center'>
      <HStack justifyContent='space-between' alignItems='center' mb={2} width='100%'>
        <Link d='flex' alignItems='flex-end' href='/'>
          <Image ignoreFallback height='45px' src={logoSVG} alt='CODENAMES' />
          <Text
            fontWeight='bold'
            letterSpacing='3px'
            fontSize='xl'
            color='white'
          >
            CODENAMES
          </Text>
        </Link>
        <Settings room={room} />
      </HStack>
      {isDesktop && (
        <Grid
          pt={8}
          gap={4}
          templateColumns='0.8fr 3fr 1fr'
        >
          <VStack spacing={8} justifyContent='space-around' maxH='775px'>
            <RedTeam room={room} playSound={playSound} />
            <BlueTeam room={room} playSound={playSound} />
          </VStack>
          <Grid justifyContent='center'>
            {canStartGame && <Board room={room} playSound={playSound} />}
            {!canStartGame && isRoomOwnerActive && <WaitingForPlayers room={room} />}
            {!canStartGame && !isRoomOwnerActive && <RoomOwnerInactive room={room} />}
          </Grid>
          <VStack spacing={8}>
            <GameLog room={room} playSound={playSound} />
            <GameChat room={room} playSound={playSound} />
          </VStack>
        </Grid>
      )}
      {!isDesktop && (
        <Grid gap={4}>
          {canStartGame && <Board room={room} playSound={playSound} />}
          {!canStartGame && isRoomOwnerActive && <WaitingForPlayers room={room} />}
          {!canStartGame && !isRoomOwnerActive && <RoomOwnerInactive room={room} />}
          <Grid templateColumns='0.5fr 1fr 0.5fr' justifyItems='center'>
            <RedTeam room={room} playSound={playSound} />
            <GameLog room={room} playSound={playSound} />
            <BlueTeam room={room} playSound={playSound} />
          </Grid>
          <Grid justifyItems='center'>
            <GameChat room={room} playSound={playSound} />
          </Grid>
        </Grid>
      )}
      <Flex
        mt={2}
        width='100%'
        justifyItems='space-between'
        alignItems='center'
      >
        <Text color='white' width='100%'>
          Version {require('../../package.json').version}
        </Text>
        <Link
          textAlign='right'
          py={2}
          isExternal
          href='https://jana19.dev'
          fontWeight='bold'
          color='white'
          width='100%'
        >
          Developed by jana19.dev
        </Link>
      </Flex>
    </Grid>
  )
}
