import { useState, useRef } from 'react'

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

import firebase from 'utils/firebase'

export default function JoinRoom ({ slug }) {
  const [isLoading, setIsLoading] = useState(false)

  const nicknameRef = useRef()
  const [nickname, setNickname] = useState('')

  const onRoomJoin = (e) => {
    e.preventDefault()

    setIsLoading(true)

    const visitorID = window.localStorage.getItem('visitorID')

    const room = firebase.ref(slug)

    const user = room.child('users').child(visitorID)
    user.set({ visitorID, nickname })
  }

  return (
    <Modal initialFocusRef={nicknameRef} isOpen isCentered>
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalHeader fontSize='2xl' textAlign='center'>Welcome to Code Names</ModalHeader>
        <ModalBody>
          <VStack spacing={8} as='form' onSubmit={onRoomJoin}>
            <Text fontWeight='bold'>{slug}</Text>
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
              colorScheme='teal'
              isLoading={isLoading}
            >
              Join Room
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
