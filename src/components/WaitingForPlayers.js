import { useEffect } from 'react'

import firebase from 'utils/firebase'

import {
  Text,
  Image,
  VStack,
  CircularProgress
} from '@chakra-ui/react'

import waitingGIF from 'images/waiting.gif'

export default function WaitingForPlayers ({ room }) {
  useEffect(() => {
    firebase.ref('rooms').child(room.name).child('state').update({ waiting: true })
  }, [])

  return (
    <VStack justifyContent='center'>
      <CircularProgress isIndeterminate color='yellow.400' thickness='16px' />
      <Text fontWeight='bold' color='white' fontSize={['lg', '2xl']} textAlign='center'>
        Waiting for players to fill in empty slots
      </Text>
      <Image ignoreFallback src={waitingGIF} alt='Waiting for players' mb={4} borderRadius='xl' />
    </VStack>
  )
}
