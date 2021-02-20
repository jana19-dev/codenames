import { useState, useEffect } from 'react'

import {
  Grid,
  Text,
  Modal,
  Image,
  VStack,
  Button,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  CircularProgress,
  ModalCloseButton
} from '@chakra-ui/react'

import logoSVG from 'images/logo.svg'

import Error from 'components/Error'

import firebase from 'utils/firebase'

export default function FindRooms ({ onClose }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const [rooms, setRooms] = useState([])

  useEffect(() => {
    firebase.ref('rooms').on('value', async (snapshot) => {
      setIsLoading(true)
      const rooms = snapshot.val()
      setRooms(rooms)
      // delete rooms if no users are active
      if (rooms) {
        for (const room of Object.values(rooms)) {
          const currentTime = new Date().getTime()
          if (parseInt((currentTime - room.ownerLastActive) / 1000) > 900) {
            // if inactive for more than 15 mins
            firebase.ref('rooms').child(room.name).set(null)
          }
        }
      }
      setIsLoading(false)
    }, setError)
  }, [])

  if (error) return <Error error={error} />

  return (
    <Modal isOpen isCentered onClose={onClose} size='lg'>
      <ModalOverlay />
      <ModalContent py={4}>
        <ModalCloseButton />
        <ModalHeader fontSize='2xl' textAlign='center'>Active Rooms</ModalHeader>
        <ModalBody pb={8}>
          <VStack spacing={4}>
            <Image ignoreFallback height='65px' src={logoSVG} alt='CODENAMES' mb={4} />
            {isLoading && (
              <>
                <Text>Searching rooms</Text>
                <CircularProgress isIndeterminate color='yellow.300' thickness='16px' />
              </>
            )}
            {!isLoading && !rooms && (
              <Text>No active rooms available to join</Text>
            )}
            {!isLoading && rooms && (
              <>
                <Grid
                  templateColumns='1fr 1fr 2fr'
                  gap={2}
                  alignItems='center'
                  width='100%'
                  fontSize='sm'
                  fontWeight='bold'
                >
                  <Text>Last Active</Text>
                  <Text>Users</Text>
                  <Text textAlign='center'>Room</Text>
                </Grid>
                {Object.values(rooms).map(room => (
                  <Grid
                    key={room.name}
                    templateColumns='1fr 1fr 2fr'
                    gap={2}
                    alignItems='center'
                    width='100%'
                  >
                    <Text>
                      {new Date(room.ownerLastActive).toLocaleTimeString()}
                    </Text>
                    <Text>
                      {room.users && Object.keys(room.users).length} users
                    </Text>
                    <Button
                      colorScheme='yellow'
                      onClick={() => { window.location.href = `/rooms/${room.name}` }}
                      size='sm'
                    >
                      {room.name}
                    </Button>
                  </Grid>
                ))}
              </>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
