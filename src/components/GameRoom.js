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

export default function GameRoom ({ room }) {
  const [playSound] = useSound(soundEffect, { interrupt: true, volume: 0.4 })

  const isDesktop = useBreakpointValue({ xl: true })

  return (
    <Box height='100%' p={[2, 4]} overflow='hidden'>
      <HStack justifyContent='space-between' alignItems='center' mb={2}>
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
          <Board room={room} playSound={playSound} />
          <VStack spacing={8}>
            <GameLog room={room} playSound={playSound} />
            <GameChat room={room} playSound={playSound} />
          </VStack>
        </Grid>
      )}
      {!isDesktop && (
        <Grid gap={4}>
          <Board room={room} playSound={playSound} />
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
      <Grid>
        <Link
          py={2}
          href='https://jana19.dev'
          fontWeight='bold'
          color='white'
          textAlign={['center', 'right']}
          width='100%'
          fontSize='sm'
        >
          developed by jana19.dev
        </Link>
      </Grid>
    </Box>
  )
}
