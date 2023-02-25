import { useEffect } from 'react'

import database from 'utils/firebase'

import {
  Text,
  Modal,
  VStack,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  CircularProgress
} from '@chakra-ui/react'

export default function RoomOwnerInactive ({ room }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      // choose a random online user - except the current room owner
      const newOwner = Object.values(room.users).find(user => {
        return user.visitorID !== room.owner && !user.lastOnline
      })
      if (newOwner) {
        database().ref(`rooms/${room.name}`).update({
          owner: newOwner.visitorID,
          lastOnline: null,
          state: 'PLAYING'
        })
      }
    }, 3000)
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <Modal isOpen isCentered size='xs'>
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalHeader fontSize='2xl' textAlign='center'>Room owner disconnected</ModalHeader>
        <ModalBody>
          <VStack>
            <Text textAlign='center'>
              Choosing a new owner from remaining players
            </Text>
            <CircularProgress isIndeterminate color='yellow.300' thickness='16px' />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
