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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const [rooms, setRooms] = useState([])

  useEffect(() => {
    firebase.ref('rooms').on('value', (snapshot) => {
      setRooms(snapshot.val())
      setIsLoading(false)
    }, setError)
  }, [])

  if (error) return <Error error={error} />

  return (
    <Modal isOpen isCentered onClose={onClose}>
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalCloseButton />
        <ModalHeader fontSize='2xl' textAlign='center'>Join a Room</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <Image ignoreFallback height='65px' src={logoSVG} alt='CODENAMES' mb={4} />
            {isLoading && (
              <CircularProgress isIndeterminate color='yellow.300' thickness='16px' />
            )}
            {!isLoading && (
              Object.values(rooms).map(room => (
                <Flex key={room.name} justifyContent='space-between' alignItems='center' width='100%'>
                  <Button colorScheme='yellow' onClick={() => { window.location.href = `/rooms/${room.name}` }}>
                    {room.name}
                  </Button>
                  <Text fontWeight='bold' fontSize='lg'>{Object.keys(room.users).length} users</Text>
                </Flex>
              ))
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
