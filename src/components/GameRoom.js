import {
  Box,
  Text,
  Grid,
  HStack
} from '@chakra-ui/react'

import Settings from 'components/game/Settings'

import Teams from 'components/game/Teams'
import StatusText from 'components/game/StatusText'
import Board from 'components/game/Board'

import GenerateWords from 'components/game/GenerateWords'
import Waiting from 'components/game/Waiting'

export default function GameRoom ({ slug, room, roomData }) {
  const visitorID = window.localStorage.getItem('visitorID')

  const roomOwnerVisitorID = roomData.owner

  return (
    <Box p={4}>
      <HStack height='45px' justifyContent='space-between' mb={4}>
        <Text
          fontWeight='bold'
          letterSpacing='3px'
          fontSize='xl'
          color='white'
        >
          CODENAMES
        </Text>
        <Settings slug={slug} room={room} roomData={roomData} />
      </HStack>
      <StatusText room={room} roomData={roomData} />
      {roomData.words && (
        <Grid
          gap={8}
          templateColumns='1fr 3fr 1fr'
          height='calc(100% - 100px)'
          overflow='auto'
        >
          <Teams room={room} roomData={roomData} />
          <Board room={room} roomData={roomData} />
        </Grid>
      )}
      {!roomData.words && roomOwnerVisitorID === visitorID && (
        <GenerateWords room={room} />
      )}

      {!roomData.words && roomOwnerVisitorID !== visitorID && (
        <Waiting />
      )}
    </Box>
  )
}
