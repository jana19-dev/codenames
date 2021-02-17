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
  const currentUser = roomData.users[visitorID]

  const [message, setMessage] = useState('')

  const onSendMessage = (e) => {
    e.preventDefault()
    room.child('chat').push({
      nickname: currentUser.nickname,
      message
    })
      .then(() => {
        setMessage('')
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      })
  }

  return (
    <VStack
      justifyContent='space-between'
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
          height={['350px', '380px']}
          overflow='auto'
        >
          {Object.values(roomData.chat).map((chat, idx) => {
            return (
              <Text
                key={idx}
                fontSize={['xs', 'sm']}
                width='100%'
                px={2}
                py={[0, 2]}
                borderRadius='lg'
                bgGradient='radial(rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.75))'
              >
                <strong>{chat.nickname}</strong>: {chat.message}
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
