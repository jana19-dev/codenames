import { startCase } from 'lodash'

import firebase from 'utils/firebase'

import {
  Text,
  Wrap,
  Grid,
  Image,
  VStack,
  Button,
  FormLabel,
  FormControl,
  useBreakpointValue
} from '@chakra-ui/react'

const JoinTeam = ({ room, team, role, playSound }) => {
  const onJoin = async () => {
    playSound()
    const visitorID = window.localStorage.getItem('visitorID')
    const currentUser = room.users[visitorID]
    const color = team === 'blue' ? '🔵 ' : '🔴'
    await firebase.ref('rooms').child(room.name).child('logs').push(`${color} ${currentUser.nickname} has joined as ${team} ${role}`)
    await firebase.ref('rooms').child(room.name).child('users').child(visitorID).update({
      team,
      role
    })
  }

  return (
    <Button
      colorScheme='yellow'
      size='sm'
      borderRadius='xl'
      my={2}
      onClick={onJoin}
      whiteSpace='normal'
    >
      Join as {startCase(role)}
    </Button>
  )
}

export default function TeamCard (props) {
  const isDesktop = useBreakpointValue({ lg: true })

  const {
    room,
    image,
    team,
    count,
    playSound,
    operatives = [],
    spymasters = [],
    isCurrentUserJoined
  } = props

  const currentTime = new Date().getTime()

  return (
    <VStack
      direction='column'
      alignItems={['center', 'left']}
      p={[1, 4]}
      maxW={['100px', '100%']}
      bgColor={team === 'red' ? 'red.700' : 'blue.700'}
      color='white'
      fontWeight='bold'
      borderRadius='xl'
      width='100%'
    >
      <Grid templateColumns={isDesktop ? '2fr 1fr' : '1fr'} alignItems='center' gap={[0, 4]}>
        {isDesktop && (
          <Image
            maxW={['100px', '200px']}
            height={['50px', '100px']}
            ignoreFallback
            src={image}
            alt='Agent'
            borderRadius='3xl'
          />
        )}
        <Text fontSize='48px' textAlign='center'>{count}</Text>
      </Grid>
      <FormControl mb={4}>
        <FormLabel fontSize={['xs', 'md']}>Operative(s)</FormLabel>
        <Wrap px={2} spacing={2}>
          {operatives.length === 0 && <Text>-</Text>}
          {operatives.map(user => (
            <Text
              key={user.visitorID}
              mx={2}
              fontSize={['xs', 'md']}
              color={parseInt((currentTime - user.lastActive) / 1000) < 10 ? 'white' : 'gray'}
            >
              {user.nickname}
              <sup>{user.visitorID === room.owner ? '  👑' : ''}</sup>
            </Text>
          ))}
        </Wrap>
        {!isCurrentUserJoined && <JoinTeam room={room} role='operative' team={team} playSound={playSound} />}
      </FormControl>
      <FormControl>
        <FormLabel fontSize={['xs', 'md']}>Spymaster(s)</FormLabel>
        <Wrap px={2} spacing={2}>
          {spymasters.length === 0 && <Text>-</Text>}
          {spymasters.map(user => (
            <Text
              key={user.visitorID}
              mx={2}
              fontSize={['xs', 'md']}
              color={parseInt((currentTime - user.lastActive) / 1000) < 10 ? 'white' : 'gray'}
            >
              {user.nickname}
              <sup>{user.visitorID === room.owner ? '  👑' : ''}</sup>
            </Text>
          ))}
        </Wrap>
        {!isCurrentUserJoined && <JoinTeam room={room} role='spymaster' team={team} playSound={playSound} />}
      </FormControl>
    </VStack>
  )
}
