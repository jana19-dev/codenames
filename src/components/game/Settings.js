import {
  Text,
  Wrap,
  Badge,
  Drawer,
  Button,
  VStack,
  FormLabel,
  DrawerBody,
  FormControl,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useClipboard,
  useDisclosure,
  FormHelperText,
  DrawerCloseButton
} from '@chakra-ui/react'

import { FcSettings } from 'react-icons/fc'
import { ImExit } from 'react-icons/im'

import EditNickname from 'components/game/EditNickname'

import useSound from 'use-sound'
import soundEffect from 'sounds/soundEffect.mp3'

import firebase from 'utils/firebase'

export default function Settings ({ room }) {
  const [play] = useSound(soundEffect)

  const visitorID = window.localStorage.getItem('visitorID')

  const roomURL = `${window.location.href}`

  const roomOwner = room.users[room.owner]
  const currentUser = room.users[visitorID]

  const { hasCopied, onCopy } = useClipboard(roomURL)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleOpen = () => {
    play()
    onOpen()
  }

  const handleOnCopy = () => {
    play()
    onCopy()
  }

  const onEditNickname = (nickname) => {
    if (nickname) {
      const user = firebase.ref('rooms').child(room.name).child('users').child(visitorID)
      user.update({ nickname })
    }
  }

  const onBecomeSpectator = () => {
    play()
    const user = firebase.ref('rooms').child(room.name).child('users').child(visitorID)
    user.update({ team: null, role: null })
  }

  const onResetWords = () => {
    play()
    firebase.ref('rooms').child(room.name).child('state').set({
      turn: 'generating_words'
    })
    firebase.ref('rooms').child(room.name).child('logs').push(`⚪ ${roomOwner.nickname} has reset the words`)
  }

  const onResetTeams = () => {
    play()
    for (const visitorID of Object.keys(room.users)) {
      const user = firebase.ref('rooms').child(room.name).child('users').child(visitorID)
      user.update({ team: null, role: null })
    }
    firebase.ref('rooms').child(room.name).child('logs').push(`⚪ ${roomOwner.nickname} has reset the teams`)
  }

  const onResetGame = () => {
    play()
    onResetTeams()
    firebase.ref('rooms').child(room.name).child('state').set({
      turn: 'generating_words'
    })
    firebase.ref('rooms').child(room.name).child('words').set(null)
    firebase.ref('rooms').child(room.name).child('logs').push(`⚪ ${roomOwner.nickname} has reset the game`)
  }

  const onLeaveRoom = () => {
    play()
    if (currentUser.visitorID === roomOwner.visitorID) {
      // transfer room ownership before removing this user
      const nonOwners = Object.values(room.users).filter(user => user.visitorID !== roomOwner.visitorID)
      if (nonOwners.length > 0) {
        const newOwner = nonOwners[0]
        firebase.ref('rooms').child(room.name).update({ owner: newOwner.visitorID })
        firebase.ref('rooms').child(room.name).child('users').child(currentUser.visitorID).set(null)
      } else {
        // no users left: delete the room
        firebase.ref('rooms').child(room.name).set(null)
      }
    } else {
      firebase.ref('rooms').child(room.name).child('users').child(currentUser.visitorID).set(null)
    }
  }

  return (
    <>
      <Button colorScheme='yellow' onClick={handleOpen} leftIcon={<FcSettings fontSize='26px' />}>
        Settings
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        size='sm'
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton size='lg' />
            <DrawerHeader>{room.name}</DrawerHeader>
            <DrawerBody>
              <VStack spacing={8}>
                <FormControl textAlign='center'>
                  <Text fontSize='sm' fontWeight='bold' mb={2}>
                    {roomURL}
                  </Text>
                  <Button onClick={handleOnCopy} colorScheme='yellow'>
                    {hasCopied ? 'Copied' : 'Copy Room Link'}
                  </Button>
                </FormControl>
                <FormControl>
                  <FormLabel>Nickname</FormLabel>
                  <EditNickname defaultValue={currentUser.nickname} onSubmit={onEditNickname} />
                  {currentUser.role && currentUser.team && (
                    <Button colorScheme='yellow' onClick={onBecomeSpectator} size='sm' mt={2}>
                      Become Spectator
                    </Button>
                  )}
                  {(!currentUser.role || !currentUser.team) && (
                    <FormHelperText color='red.500' fontWeight='bold'>
                      Spectating - Join a team to play
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel>Room Owner</FormLabel>
                  <Badge
                    colorScheme={roomOwner.team === 'blue' ? 'blue' : roomOwner.team === 'red' ? 'red' : 'gray'}
                    fontSize='md'
                    fontWeight='bold'
                    borderRadius='lg'
                  >
                    {roomOwner.nickname}
                  </Badge>
                </FormControl>
                <FormControl>
                  <FormLabel>Active Players</FormLabel>
                  <Wrap mb={4}>
                    {Object.values(room.users).filter(user => user.team && user.role).map(user => (
                      <Badge
                        key={user.visitorID}
                        mx={2}
                        colorScheme={user.team === 'blue' ? 'blue' : user.team === 'red' ? 'red' : 'gray'}
                        fontSize='md'
                        fontWeight='bold'
                        borderRadius='lg'
                      >
                        {user.nickname}
                      </Badge>
                    ))}
                  </Wrap>
                </FormControl>
                <FormControl>
                  <FormLabel>Spectating Players</FormLabel>
                  <Wrap mb={4}>
                    {Object.values(room.users).filter(user => !user.team || !user.role).map(user => (
                      <Badge
                        key={user.visitorID}
                        mx={2}
                        colorScheme={user.team === 'blue' ? 'blue' : user.team === 'red' ? 'red' : 'gray'}
                        fontSize='md'
                        fontWeight='bold'
                        borderRadius='lg'
                      >
                        {user.nickname}
                      </Badge>
                    ))}
                  </Wrap>
                </FormControl>
                {roomOwner.visitorID === visitorID && (
                  <FormControl>
                    <Button colorScheme='yellow' onClick={onResetWords}>
                      Reset Words
                    </Button>
                    <FormHelperText color='red.500' fontWeight='bold'>
                      The words will be reset for this game.
                    </FormHelperText>
                  </FormControl>
                )}
                {roomOwner.visitorID === visitorID && (
                  <FormControl>
                    <Button colorScheme='yellow' onClick={onResetTeams}>
                      Reset Teams
                    </Button>
                    <FormHelperText color='red.500' fontWeight='bold'>
                      The teams will be reset for this room.
                    </FormHelperText>
                  </FormControl>
                )}
                {roomOwner.visitorID === visitorID && (
                  <FormControl>
                    <Button colorScheme='yellow' onClick={onResetGame}>
                      Reset Game
                    </Button>
                    <FormHelperText color='red.500' fontWeight='bold'>
                      Warning! <br /> The words and teams will be reset for this room.
                    </FormHelperText>
                  </FormControl>
                )}
              </VStack>
            </DrawerBody>

            <DrawerFooter justifyContent='center'>
              <Button colorScheme='red' leftIcon={<ImExit fontSize='26px' />} onClick={onLeaveRoom}>
                Leave Room
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}
