import { useState, useRef } from 'react'

import {
  Text,
  Input,
  VStack,
  Button,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react'

export default function GameChat ({ room, roomData }) {
  const messagesEndRef = useRef()

  const visitorID = window.localStorage.getItem('visitorID')

  const [message, setMessage] = useState('')

  const onSendMessage = (e) => {
    e.preventDefault()
    room.child('chat').push({
      visitorID,
      message
    })
      .then(() => {
        setMessage('')
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      })
  }

  return (
    <VStack
      width='100%'
      height={['350px', '380px']}
      maxW={['100%', '450px']}
      bgGradient='radial(rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.75))'
      color='white'
      borderRadius='lg'
    >
      <Text fontWeight='bold' mt={2}>Game Chat</Text>
      {roomData.chat && (
        <VStack
          spacing={1}
          width='100%'
          overflow='auto'
        >
          {Object.values(roomData.chat).map((chat, idx) => {
            const user = roomData.users[chat.visitorID]
            return (
              <Text
                key={idx}
                width='100%'
                px={2}
                py={1}
                borderRadius='lg'
                bgGradient='radial(rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.75))'
                fontSize='sm'
              >
                <strong>{user.nickname}</strong>: {chat.message}
              </Text>
            )
          })}
          <div ref={messagesEndRef} />
        </VStack>
      )}
      <InputGroup size='lg' as='form' onSubmit={onSendMessage} height='50px'>
        <Input
          justifySelf='flex-end'
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <InputRightElement width='4rem' mr={1}>
          <Button
            size='sm'
            onClick={onSendMessage}
            colorScheme='yellow'
            type='submit'
            isDisabled={!message}
          >
            Send
          </Button>
        </InputRightElement>
      </InputGroup>
    </VStack>
  )
}
