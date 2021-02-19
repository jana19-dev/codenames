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

import useSound from 'use-sound'
import soundEffect from 'sounds/soundEffect.mp3'

export default function GameRoom ({ room, roomData }) {
  const [playSound] = useSound(soundEffect, { interrupt: true, volume: 0.4 })

  const isDesktop = useBreakpointValue({ xl: true })

  return (
    <Box height='100%' p={[2, 4]} overflow='hidden'>
      <HStack height='65px' justifyContent='space-between' alignItems='center'>
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
        <Settings room={room} roomData={roomData} />
      </HStack>
      {isDesktop && (
        <Grid
          pt={8}
          gap={4}
          templateColumns='0.8fr 3fr 1fr'
          height='calc(100% - 45px)'
          overflow='auto'
        >
          <VStack spacing={8} justifyContent='space-around' maxH='775px'>
            <RedTeam room={room} roomData={roomData} playSound={playSound} />
            <BlueTeam room={room} roomData={roomData} playSound={playSound} />
          </VStack>
          <Board room={room} roomData={roomData} playSound={playSound} />
          <VStack spacing={8}>
            <GameLog room={room} roomData={roomData} playSound={playSound} />
            <GameChat room={room} roomData={roomData} playSound={playSound} />
          </VStack>
        </Grid>
      )}
      {!isDesktop && (
        <Grid
          gap={4}
          height='calc(100% - 65px)'
          overflow='auto'
          overflowX='hidden'
        >
          <Board room={room} roomData={roomData} playSound={playSound} />
          <Grid templateColumns='0.5fr 1fr 0.5fr' justifyItems='center'>
            <RedTeam room={room} roomData={roomData} playSound={playSound} />
            <GameLog room={room} roomData={roomData} playSound={playSound} />
            <BlueTeam room={room} roomData={roomData} playSound={playSound} />
          </Grid>
          <Grid justifyItems='center'>
            <GameChat room={room} roomData={roomData} playSound={playSound} />
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
