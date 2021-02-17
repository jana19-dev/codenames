import {
  Box,
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

import RedTeam from 'components/game/teams/RedTeam'
import BlueTeam from 'components/game/teams/BlueTeam'
import Board from 'components/game/Board'
import GameLog from 'components/game/GameLog'
import GameChat from 'components/game/GameChat'

export default function GameRoom ({ room, roomData }) {
  const isDesktop = useBreakpointValue({ xl: true })

  return (
    <Box height='100%' p={[2, 4]} pb={4}>
      <HStack height='45px' justifyContent='space-between' mb={2}>
        <Link d='flex' alignItems='flex-end' href='/'>
          <Text
            fontWeight='bold'
            letterSpacing='3px'
            fontSize='xl'
            color='white'
          >
            CODENAMES
          </Text>
          <Image ignoreFallback height='45px' src={logoSVG} alt='CODENAMES' />
        </Link>
        <Settings room={room} roomData={roomData} />
      </HStack>
      {isDesktop && (
        <Grid
          gap={4}
          templateColumns='0.8fr 3fr 1fr'
          height='calc(100% - 45px)'
          overflow='auto'
        >
          <VStack spacing={8}>
            <RedTeam room={room} roomData={roomData} />
            <BlueTeam room={room} roomData={roomData} />
          </VStack>
          <Board room={room} roomData={roomData} />
          <VStack spacing={8}>
            <GameLog room={room} roomData={roomData} />
            <GameChat room={room} roomData={roomData} />
          </VStack>
        </Grid>
      )}
      {!isDesktop && (
        <Grid
          gap={4}
          height='calc(100% - 45px)'
          overflow='auto'
        >
          <Board room={room} roomData={roomData} />
          <Grid templateColumns='0.5fr 1fr 0.5fr' justifyItems='center'>
            <RedTeam room={room} roomData={roomData} />
            <GameLog room={room} roomData={roomData} />
            <BlueTeam room={room} roomData={roomData} />
          </Grid>
          <Grid justifyItems='center'>
            <GameChat room={room} roomData={roomData} />
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
