import { useEffect } from 'react'

import firebase from 'utils/firebase'

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
      // choose a random user - not the current room owner
      const currentTime = new Date().getTime()
      const newOwner = Object.values(room.users).find(user => {
        return user.visitorID !== room.owner && parseInt((currentTime - user.lastActive) / 1000) < 10
      })
      if (newOwner) {
        firebase.ref('rooms').child(room.name).update({ owner: newOwner.visitorID })
      }
    }, 5000)
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <Modal isOpen isCentered size='xs'>
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalHeader fontSize='2xl' textAlign='center'>Room owner has been disconnected</ModalHeader>
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
