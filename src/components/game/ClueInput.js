import { useState } from 'react'

import {
  Input,
  Button,
  Portal,
  HStack,
  Popover,
  InputGroup,
  PopoverBody,
  useDisclosure,
  PopoverContent,
  PopoverTrigger,
  InputLeftElement,
  InputRightElement
} from '@chakra-ui/react'

export default function ClueInput ({ room, roomData, playSound }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const visitorID = window.localStorage.getItem('visitorID')
  const currentUser = roomData.users[visitorID]

  const [clue, setClue] = useState('')
  const [count, setCount] = useState(1)

  const onSendClue = (e) => {
    playSound()
    e.preventDefault()
    const currentTurn = roomData.state.turn
    room.child('state').update({
      clue,
      count,
      turn: currentTurn === 'red_spymaster' ? 'red_operative' : 'blue_operative'
    })
    const color = currentUser.team === 'blue' ? '🔵 ' : '🔴'
    room.child('logs').push(`${color} ${currentUser.nickname} gives clue ${clue} - ${count}`)
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
              onClick={onOpen}
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
                      onClick={() => { setCount(idx + 1); onClose() }}
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
