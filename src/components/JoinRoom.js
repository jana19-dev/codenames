import { useState, useRef } from 'react'

import firebase from 'utils/firebase'

import {
  Text,
  Modal,
  Input,
  VStack,
  Button,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalOverlay
} from '@chakra-ui/react'

export default function JoinRoom ({ room, playSound }) {
  const [isLoading, setIsLoading] = useState(false)

  const nicknameRef = useRef()
  const [nickname, setNickname] = useState('')

  const onRoomJoin = async (e) => {
    e.preventDefault()
    await playSound()
    setIsLoading(true)
    const visitorID = window.localStorage.getItem('visitorID')
    firebase.ref('rooms').child(room.name).child('users').child(visitorID).set({ visitorID, nickname })
  }

  return (
    <Modal initialFocusRef={nicknameRef} isOpen isCentered>
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalHeader fontSize='2xl' textAlign='center'>Welcome to Code Names</ModalHeader>
        <ModalBody>
          <VStack spacing={8} as='form' onSubmit={onRoomJoin}>
            <Text fontWeight='bold'>{room.name}</Text>
            <Text>To enter the room, choose a nickname</Text>
            <Input
              required
              ref={nicknameRef}
              value={nickname}
              onChange={e => setNickname(e.target.value.trim())}
              placeholder='Enter your nickname'
              maxW='250px'
            />
            <Button
              type='submit'
              colorScheme='yellow'
              isLoading={isLoading}
              size='lg'
            >
              Join Room
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
