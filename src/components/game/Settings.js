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

export default function Settings ({ slug, room, roomData }) {
  const visitorID = window.localStorage.getItem('visitorID')

  const roomURL = `https://adsadasdsa/room/${slug}`

  const roomOwner = roomData.users[roomData.owner]
  const currentUser = roomData.users[visitorID]

  const { hasCopied, onCopy } = useClipboard(roomURL)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const onEditNickname = (nickname) => {
    if (nickname) {
      const user = room.child('users').child(visitorID)
      user.update({ nickname })
    }
  }

  const onBecomeSpectator = () => {
    const user = room.child('users').child(visitorID)
    user.update({ team: null, role: null })
  }

  const onResetTeams = () => {
    for (const visitorID of Object.keys(roomData.users)) {
      const user = room.child('users').child(visitorID)
      user.update({ team: null, role: null })
    }
  }

  const onResetGame = () => {
    onResetTeams()
    room.child('words').set(null)
      .then(() => onClose())
  }

  const onLeaveRoom = () => {
    if (currentUser.visitorID === roomOwner.visitorID) {
      // transfer room ownership before removing this user
      const nonOwners = Object.values(roomData.users).filter(user => user.visitorID !== roomOwner.visitorID)
      if (nonOwners.length > 0) {
        const newOwner = nonOwners[0]
        room.update({ owner: newOwner.visitorID })
        room.child('users').child(currentUser.visitorID).set(null)
      } else {
        // no users left: delete the room
        room.set(null)
      }
    } else {
      room.child('users').child(currentUser.visitorID).set(null)
    }
  }

  return (
    <>
      <Button colorScheme='yellow' onClick={onOpen} leftIcon={<FcSettings fontSize='26px' />}>
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
            <DrawerHeader>{slug}</DrawerHeader>
            <DrawerBody>
              <VStack spacing={8}>
                <FormControl textAlign='center'>
                  <Text fontSize='sm' fontWeight='bold' mb={2}>
                    {roomURL}
                  </Text>
                  <Button onClick={onCopy} colorScheme='yellow'>
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
                    {Object.values(roomData.users).filter(user => user.team && user.role).map(user => (
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
                    {Object.values(roomData.users).filter(user => !user.team || !user.role).map(user => (
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
                    <Button colorScheme='yellow' onClick={onResetTeams}>
                      Reset Teams
                    </Button>
                    <FormHelperText color='red.500' fontWeight='bold'>
                      The teams teams will be reset for this room.
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
