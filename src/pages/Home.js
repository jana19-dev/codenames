import { useEffect, useState, useRef } from 'react'

import FindRooms from 'components/FindRooms'

import { generateSlug } from 'random-word-slugs'

import {
  Text,
  Modal,
  Input,
  Image,
  VStack,
  Button,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalOverlay
} from '@chakra-ui/react'

import logoSVG from 'images/logo.svg'

import firebase from 'utils/firebase'

import useSound from 'use-sound'
import soundEffect from 'sounds/soundEffect.mp3'

export default function Home () {
  const [isLoading, setIsLoading] = useState(false)

  const [isFindingRooms, setIsFindingRooms] = useState(false)

  const [play] = useSound(soundEffect)

  const nicknameRef = useRef()
  const [nickname, setNickname] = useState('')

  useEffect(() => {
    // clean the url
    window.history.replaceState(null, null, '/')
  }, [])

  const onRoomCreate = (e) => {
    e.preventDefault()
    play()

    setIsLoading(true)

    const name = generateSlug()
    const visitorID = window.localStorage.getItem('visitorID')

    const room = firebase.ref('rooms').child(name)

    room.set({ name, owner: visitorID, logs: [], state: { turn: 'generating_words' } })
      .then(() => {
        room.child('logs').push(`⚪  ${nickname} created the room 😎 `)
        const user = room.child('users').child(visitorID)
        user.set({ visitorID, nickname })
          .then(() => {
            window.location.href = `/rooms/${name}`
          })
      })
  }

  return (
    <>
      {isFindingRooms && <FindRooms onClose={() => setIsFindingRooms(false)} />}
      <Modal initialFocusRef={nicknameRef} isOpen isCentered>
        <ModalOverlay />
        <ModalContent pb={4}>
          <ModalHeader fontSize='2xl' textAlign='center'>Welcome to CODENAMES</ModalHeader>
          <ModalBody>
            <VStack spacing={8} as='form' onSubmit={onRoomCreate}>
              <Image ignoreFallback height='65px' src={logoSVG} alt='CODENAMES' />
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
                colorScheme='yellow'
                size='lg'
                isLoading={isLoading}
              >
                Create Room
              </Button>
              <Text>OR</Text>
              <Button
                colorScheme='yellow'
                size='lg'
                onClick={() => setIsFindingRooms(true)}
              >
                Find Rooms
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
