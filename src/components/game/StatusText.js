import {
  Flex,
  Text
} from '@chakra-ui/react'

export default function StatusText ({ room, roomData }) {
  const visitorID = window.localStorage.getItem('visitorID')
  const currentUser = roomData.users[visitorID]

  let text = ''
  if (roomData.state.turn.includes('spymaster')) {
    if (roomData.state.turn.includes(currentUser.role) && roomData.state.turn.includes(currentUser.team)) {
      text = 'Give your operatives a clue'
    } else {
      text = 'Waiting for opponent spymaster to give a clue'
    }
  } else if (roomData.state.turn.includes('operative')) {
    if (roomData.state.turn.includes(currentUser.role) && roomData.state.turn.includes(currentUser.team)) {
      text = 'Give your operatives a clue'
    } else {
      text = 'Waiting for opponent spymaster to give a clue'
    }
  }

  return (
    <Flex
      height={['40px', '55px']}
      margin='auto'
      justifyContent='center'
      mb={4}
      borderRadius='xl'
      bgGradient='linear(to-r, red.600, orange.600)'
      width='fit-content'
      p={2}
      color='white'
      alignItems='center'
    >
      <Text fontWeight='bold' fontSize={['sm', '2xl']} letterSpacing={['0.5px', '1px']} height='100%'>
        {text}
      </Text>
    </Flex>
  )
}
