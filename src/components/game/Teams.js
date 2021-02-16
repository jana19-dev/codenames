import { startCase } from 'lodash'

import {
  Text,
  Wrap,
  Grid,
  Image,
  VStack,
  Button,
  FormLabel,
  FormControl
} from '@chakra-ui/react'

import redPNG from 'images/red.png'
import bluePNG from 'images/blue.png'

const JoinTeam = ({ room, team, role }) => {
  const onJoin = () => {
    const visitorID = window.localStorage.getItem('visitorID')
    const user = room.child('users').child(visitorID)
    user.child('team').set(team)
    user.child('role').set(role)
  }

  return (
    <Button colorScheme='yellow' size='sm' borderRadius='xl' my={2} onClick={onJoin}>
      Join as {startCase(role)}
    </Button>
  )
}

const TeamCard = (props) => {
  const {
    room,
    image,
    team,
    count,
    operatives = [],
    spymasters = [],
    isCurrentUserJoined
  } = props

  return (
    <VStack
      alignItems='left'
      p={4}
      width='100%'
      bgColor={team === 'red' ? 'red.700' : 'blue.700'}
      color='white'
      fontWeight='bold'
      borderRadius='xl'
    >
      <Grid templateColumns='2fr 1fr' alignItems='center' gap={4}>
        <Image maxW='200px' height='100px' ignoreFallback src={image} alt='Agent' borderRadius='3xl' />
        <Text fontSize='48px' textAlign='center'>{count}</Text>
      </Grid>
      <FormControl mb={4}>
        <FormLabel>Operative(s)</FormLabel>
        <Wrap px={2} spacing={2}>
          {operatives.length === 0 && <Text>-</Text>}
          {operatives.map(user => <Text key={user.visitorID}>{user.nickname}</Text>)}
        </Wrap>
        {!isCurrentUserJoined && <JoinTeam room={room} role='operative' team={team} />}
      </FormControl>
      <FormControl>
        <FormLabel>Spymaster(s)</FormLabel>
        <Wrap px={2} spacing={2}>
          {spymasters.length === 0 && <Text>-</Text>}
          {spymasters.map(user => <Text key={user.visitorID}>{user.nickname}</Text>)}
        </Wrap>
        {!isCurrentUserJoined && <JoinTeam room={room} role='spymaster' team={team} />}
      </FormControl>
    </VStack>
  )
}

export default function Teams ({ room, roomData }) {
  const visitorID = window.localStorage.getItem('visitorID')

  const currentUser = roomData.users[visitorID]

  const remainingRedCount = roomData.words.filter(({ agent, guessed }) => agent === 'red' && !guessed).length
  const remainingBlueCount = roomData.words.filter(({ agent, guessed }) => agent === 'blue' && !guessed).length

  const redOperatives = Object.values(roomData.users).filter(user => user.team === 'red' && user.role === 'operative')
  const redSpymasters = Object.values(roomData.users).filter(user => user.team === 'red' && user.role === 'spymaster')

  const blueOperatives = Object.values(roomData.users).filter(user => user.team === 'blue' && user.role === 'operative')
  const blueSpymasters = Object.values(roomData.users).filter(user => user.team === 'blue' && user.role === 'spymaster')

  const isCurrentUserJoined = currentUser.team && currentUser.role

  return (
    <VStack>
      <TeamCard
        room={room}
        team='red'
        count={remainingRedCount}
        image={redPNG}
        operatives={redOperatives}
        spymasters={redSpymasters}
        isCurrentUserJoined={isCurrentUserJoined}
      />
      <TeamCard
        room={room}
        team='blue'
        count={remainingBlueCount}
        image={bluePNG}
        operatives={blueOperatives}
        spymasters={blueSpymasters}
        isCurrentUserJoined={isCurrentUserJoined}
      />
    </VStack>
  )
}
