import {
  Flex,
  Text
} from '@chakra-ui/react'

export default function StatusText ({ roomData }) {
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
      <Text fontWeight='bold' fontSize={['md', '2xl']} letterSpacing={['0.5px', '1px']} height='100%'>
        Wait for your spymaster to give you a clue...
      </Text>
    </Flex>
  )
}
