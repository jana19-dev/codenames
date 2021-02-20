import { useState, useRef } from 'react'

import firebase from 'utils/firebase'

import {
  Text,
  Input,
  VStack,
  Button,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react'

export default function GameChat ({ room, playSound }) {
  const messagesEndRef = useRef()

  const visitorID = window.localStorage.getItem('visitorID')
  const currentUser = room.users[visitorID]

  const [message, setMessage] = useState('')

  const onSendMessage = async (e) => {
    e.preventDefault()
    await playSound()
    await firebase.ref('rooms').child(room.name).child('chat').push({
      nickname: currentUser.nickname,
      message
    })
    setMessage('')
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
    }
  }

  return (
    <VStack
      justifyContent='space-between'
      height={['350px', '380px']}
      w={['100%', '420px']}
      bgGradient='radial(rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.75))'
      color='white'
      borderRadius='lg'
      overflowX='hidden'
    >
      <Text fontWeight='bold' mt={2}>Room Chat</Text>
      {room.chat && (
        <VStack
          spacing={1}
          width='100%'
          height={['300px', '330px']}
          overflow='auto'
          ref={messagesEndRef}
        >
          {Object.values(room.chat).map((chat, idx) => {
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
                <code><strong>{chat.nickname}</strong> 👉 {chat.message}</code>
              </Text>
            )
          })}
        </VStack>
      )}
      <InputGroup size='lg' as='form' onSubmit={onSendMessage} height='50px'>
        <Input
          justifySelf='flex-end'
          value={message}
          onChange={e => setMessage(e.target.value.slice(0, 40))}
          borderColor='white'
        />
        <InputRightElement width='4rem' mr={1}>
          <Button
            size='sm'
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
