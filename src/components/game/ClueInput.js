import { useState, useEffect } from 'react'

import firebase from 'utils/firebase'

import {
  Input,
  Button,
  Portal,
  HStack,
  Popover,
  useToast,
  InputGroup,
  PopoverBody,
  useDisclosure,
  PopoverContent,
  PopoverTrigger,
  InputLeftElement,
  InputRightElement
} from '@chakra-ui/react'

export default function ClueInput ({ room, playSound }) {
  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const visitorID = window.localStorage.getItem('visitorID')
  const currentUser = room.users[visitorID]

  const [clue, setClue] = useState('')
  const [count, setCount] = useState(1)

  useEffect(() => {
    // start timer
    let initial = 120
    const timer = setInterval(async () => {
      if (initial <= 0) {
        // end round
        clearTimeout(timer)
        await firebase.ref('rooms').child(room.name).child('state').update({ timer: null })
        const color = currentUser.team === 'blue' ? '🔵 ' : '🔴'
        const currentTurn = room.state.turn
        await firebase.ref('rooms').child(room.name).child('logs').push(`${color} ${currentUser.nickname} ran out of time ⏱️`)
        // clear hints
        for (const word of Object.keys(room.words)) {
          await firebase.ref('rooms').child(room.name).child('words').child(word).update({ hints: null })
        }
        await firebase.ref('rooms').child(room.name).child('state').update({
          clue: null,
          count: null,
          turn: currentTurn === 'red_spymaster' ? 'blue_spymaster' : 'red_spymaster'
        })
      } else {
        await firebase.ref('rooms').child(room.name).child('state').update({ timer: initial })
        initial -= 1
      }
    }, 1000)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  const onSendClue = async (e) => {
    e.preventDefault()
    toast.closeAll()
    await playSound()
    let isValidClue = true
    for (const word of Object.keys(room.words)) {
      if (clue.includes(word)) {
        isValidClue = false
        break
      }
    }
    if (isValidClue) {
      const currentTurn = room.state.turn
      const color = currentUser.team === 'blue' ? '🔵 ' : '🔴'
      await firebase.ref('rooms').child(room.name).child('logs').push(`${color} ${currentUser.nickname} gives clue ${clue} 🤞 ${count}`)
      await firebase.ref('rooms').child(room.name).child('state').update({
        clue,
        count,
        turn: currentTurn === 'red_spymaster' ? 'red_operative' : 'blue_operative'
      })
    } else {
      toast({
        title: 'Invalid clue',
        description: 'The clue cannot contain any of the words.',
        status: 'error',
        duration: 9000,
        isClosable: true
      })
    }
  }

  const onClueCountOpen = async () => {
    await playSound()
    onOpen()
  }

  const onClueCount = async (count) => {
    await playSound()
    setCount(count)
    onClose()
  }

  return (
    <InputGroup
      size='lg'
      as='form'
      onSubmit={onSendClue}
      maxW='400px'
      bgGradient='radial(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.75))'
      borderRadius='xl'
    >
      <InputLeftElement width='3rem' mr={1}>
        <Popover placement='top' isOpen={isOpen} onClose={onClose}>
          <PopoverTrigger>
            <Button
              size='sm'
              colorScheme='yellow'
              fontSize='22px'
              fontWeight='bold'
              onClick={onClueCountOpen}
            >
              {count}
            </Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent
              width={['100vw', '400px']}
              bgGradient='radial(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.75))'
              border='none'
            >
              <PopoverBody>
                <HStack>
                  {Array.from(new Array(8).keys()).map(idx => (
                    <Button
                      key={idx + 1}
                      colorScheme={count === idx + 1 ? 'yellow' : 'gray'}
                      size='md'
                      onClick={() => onClueCount(idx + 1)}
                    >
                      {idx + 1}
                    </Button>
                  ))}
                </HStack>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </InputLeftElement>
      <Input
        fontWeight='bold'
        color='white'
        border='none'
        justifySelf='flex-end'
        placeholder='Type your clue here'
        value={clue}
        onChange={e => setClue(e.target.value.trim().toUpperCase().slice(0, 20))}
        borderRadius='2xl'
      />
      <InputRightElement width='6rem' mr={1}>
        <Button
          size='md'
          colorScheme='yellow'
          type='submit'
          isDisabled={!clue}
        >
          Give Clue
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}
