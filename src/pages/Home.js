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
  FormLabel,
  ModalBody,
  FormControl,
  ModalHeader,
  ModalContent,
  ModalOverlay
} from '@chakra-ui/react'

import logoSVG from 'images/logo.svg'

import database from 'utils/firebase'

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

  const onRoomCreate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    await play()
    const name = generateSlug()
    const visitorID = window.localStorage.getItem('visitorID')
    await database().ref(`rooms/${name}`).set({
      name,
      owner: visitorID,
      users: { [visitorID]: { visitorID, nickname } },
      state: 'GENERATING_WORDS'
    })
    window.location.href = `/rooms/${name}`
  }

  return (
    <Modal initialFocusRef={nicknameRef} isOpen isCentered>
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalHeader fontSize='2xl' textAlign='center' letterSpacing='2px'>
          CODENAMES
        </ModalHeader>
        <ModalBody>
          {isFindingRooms && <FindRooms onClose={() => setIsFindingRooms(false)} />}
          <VStack spacing={4} as='form' onSubmit={onRoomCreate}>
            <Image ignoreFallback height='65px' width='65px' src={logoSVG} alt='CODENAMES' />
            <FormControl textAlign='center'>
              <FormLabel textAlign='center'>To create a new room, choose a nickname</FormLabel>
              <Input
                required
                ref={nicknameRef}
                value={nickname}
                onChange={e => setNickname(e.target.value.trim().toLowerCase())}
                placeholder='Enter your nickname'
                maxW='250px'
              />
            </FormControl>
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
  )
}
