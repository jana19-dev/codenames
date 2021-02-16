import { useEffect, useState, useRef } from 'react'

import { generateSlug } from 'random-word-slugs'

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

export default function Home () {
  const [isLoading, setIsLoading] = useState(false)

  const nicknameRef = useRef()
  const [nickname, setNickname] = useState('')

  useEffect(() => {
    // clean the url
    window.history.replaceState(null, null, '/')
  }, [])

  const onRoomCreate = (e) => {
    e.preventDefault()
    setIsLoading(true)
    const slug = generateSlug()
    const visitorID = window.localStorage.getItem('visitorID')

    const room = firebase.ref(slug)

    room.set({ slug, owner: visitorID })

    const user = room.child('users').child(visitorID)
    user.set({ visitorID, nickname })
      .then(() => {
        window.location.href = `/room/${slug}`
      })
  }

  return (
    <Modal initialFocusRef={nicknameRef} isOpen isCentered>
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalHeader fontSize='2xl' textAlign='center'>Welcome to Code Names</ModalHeader>
        <ModalBody>
          <VStack spacing={8} as='form' onSubmit={onRoomCreate}>
            <Text>To create a new room, choose a nickname</Text>
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
              Create Room
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
