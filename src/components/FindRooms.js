import { useState, useEffect } from 'react'

import {
  Flex,
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
      const rooms = snapshot.val()
      setRooms(rooms)
      // delete rooms if no users are active
      for (const room of Object.values(rooms)) {
        const currentTime = new Date().getTime()
        let activeUsersCount = Object.keys(room.users).length
        for (const user of Object.values(room.users)) {
          if (!user.lastActive || parseInt((currentTime - user.lastActive) / 1000) < 300) {
            // user is inactive for 5mins - delete
            activeUsersCount -= 1
          }
        }
        if (activeUsersCount === 0) {
          // no users left: delete the room
          await firebase.ref('rooms').child(room.name).set(null)
        }
      }
      setRooms(snapshot.val())
      setIsLoading(false)
    }, setError)
  }, [])

  if (error) return <Error error={error} />

  return (
    <Modal isOpen isCentered onClose={onClose}>
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
            {!isLoading && (
              Object.values(rooms).map(room => (
                <Flex
                  key={room.name}
                  justifyContent='space-between'
                  alignItems='center'
                  width='100%'
                >
                  <Text>
                    {new Date(1613793680248).toLocaleTimeString(room.ownerLastActive)}
                  </Text>
                  <Text
                    fontWeight='bold'
                  >
                    {Object.keys(room.users).length} users
                  </Text>
                  <Button
                    colorScheme='yellow'
                    onClick={() => { window.location.href = `/rooms/${room.name}` }}
                  >
                    {room.name}
                  </Button>
                </Flex>
              ))
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
